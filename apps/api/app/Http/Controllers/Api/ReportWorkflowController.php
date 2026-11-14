<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Listing;
use App\Models\Report;
use App\Models\ReportEvent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ReportWorkflowController extends Controller
{
    public function cases(Request $request): JsonResponse
    {
        $user = $request->user();
        $reports = Report::query()
            ->where(fn ($query) => $query->where('reporter_id', $user->id)->orWhere('subject_user_id', $user->id))
            ->with(['listing:id,title,business_name', 'claim.listing:id,title,business_name'])
            ->latest()->paginate(15);
        $reports->getCollection()->transform(fn (Report $report) => $this->caseData($report, $user));

        return response()->json($reports);
    }

    public function showCase(Request $request, int $reportId): JsonResponse
    {
        $user = $request->user();
        $report = Report::query()->with(['listing:id,title,business_name', 'claim.listing:id,title,business_name', 'events' => fn ($query) => $query->orderBy('created_at')])->findOrFail($reportId);
        abort_unless($this->isParticipant($report, $user), 404);

        return response()->json([
            ...$this->caseData($report, $user),
            'events' => $report->events->filter(fn (ReportEvent $event) => $this->eventVisibleTo($event, $report, $user))
                ->values()->map(fn (ReportEvent $event) => ['type' => $event->event_type, 'body' => $event->body, 'created_at' => $event->created_at]),
        ]);
    }

    public function respond(Request $request, int $reportId): JsonResponse
    {
        $data = $request->validate(['body' => ['required', 'string', 'min:2', 'max:3000']]);
        $report = Report::query()->findOrFail($reportId);
        abort_unless((int) $report->subject_user_id === (int) $request->user()->id, 404);
        abort_unless($report->status === 'awaiting_response', 409, 'Kasus tidak sedang menunggu jawaban.');
        abort_if($report->response_due_at && $report->response_due_at->isPast(), 409, 'Batas waktu jawaban sudah lewat. Hubungi admin melalui proses banding setelah keputusan.');

        $report->events()->create([
            'actor_id' => $request->user()->id,
            'event_type' => 'subject_response',
            'visibility' => 'subject_visible',
            'body' => trim($data['body']),
        ]);

        return response()->json(['message' => 'Jawaban berhasil dikirim untuk ditinjau admin.']);
    }

    public function appeal(Request $request, int $reportId): JsonResponse
    {
        $data = $request->validate(['body' => ['required', 'string', 'min:5', 'max:3000']]);
        $report = Report::query()->findOrFail($reportId);
        abort_unless((int) $report->subject_user_id === (int) $request->user()->id, 404);
        abort_unless($report->status === 'resolved_action' && $report->decision_action !== 'no_action', 409, 'Kasus ini tidak memiliki keputusan yang dapat dibanding.');
        abort_if($report->appealed_at !== null, 409, 'Banding untuk kasus ini sudah pernah diajukan.');
        abort_if(! $report->appeal_deadline_at || $report->appeal_deadline_at->isPast(), 409, 'Batas waktu banding 7 hari telah lewat.');

        DB::transaction(function () use ($report, $request, $data): void {
            $report->update(['status' => 'appealed', 'appealed_at' => now(), 'appeal_reason' => trim($data['body'])]);
            $report->events()->create([
                'actor_id' => $request->user()->id,
                'event_type' => 'appeal_submitted',
                'visibility' => 'admin_only',
                'body' => trim($data['body']),
            ]);
        });

        return response()->json(['message' => 'Banding berhasil dikirim dan menunggu peninjauan admin.']);
    }

    public function adminAction(Request $request, int $reportId): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', Rule::in(['assign_subject', 'review', 'request_response', 'decide', 'hold_listing', 'release_hold', 'resolve_appeal'])],
            'subject_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'summary' => ['nullable', 'string', 'min:5', 'max:1500'],
            'response_due_at' => ['nullable', 'date', 'after:now'],
            'decision' => ['nullable', Rule::in(['no_action', 'warning', 'hide_listing', 'restrict_account'])],
            'reason' => ['nullable', 'string', 'min:5', 'max:2000'],
            'reporter_summary' => ['nullable', 'string', 'min:5', 'max:1000'],
            'severe' => ['sometimes', 'boolean'],
            'appeal_outcome' => ['nullable', Rule::in(['upheld', 'overturned'])],
        ]);

        return DB::transaction(function () use ($request, $reportId, $data): JsonResponse {
            $report = Report::query()->with(['listing', 'claim.listing'])->lockForUpdate()->findOrFail($reportId);
            $listing = $report->listing ?? $report->claim?->listing;
            $admin = $request->user();
            $before = ['status' => $report->status, 'decision_action' => $report->decision_action, 'listing_moderation' => $listing?->moderation_status, 'subject_moderation' => $report->subject?->moderation_status];
            $eventType = $data['action'];
            $eventBody = $data['reason'] ?? $data['summary'] ?? null;

            switch ($data['action']) {
                case 'assign_subject':
                    abort_unless(! $report->subject_user_id && isset($data['subject_user_id']), 409, 'Subjek sudah ditentukan atau belum dipilih.');
                    $candidateIds = array_values(array_filter([
                        $listing?->owner_id,
                        $report->claim?->claimant_id,
                    ], fn ($id) => $id && (int) $id !== (int) $report->reporter_id));
                    abort_unless(in_array((int) $data['subject_user_id'], array_map('intval', $candidateIds), true), 422, 'Pilih hanya pihak lain yang terlibat dalam listing atau klaim ini.');
                    $report->update(['subject_user_id' => $data['subject_user_id']]);
                    $eventType = 'subject_assigned';
                    $eventBody = 'Pihak terlapor ditentukan setelah pemeriksaan admin.';
                    break;

                case 'review':
                    abort_unless($report->status === 'open', 409, 'Hanya laporan baru yang dapat mulai ditinjau.');
                    $report->update(['status' => 'under_review']);
                    break;

                case 'request_response':
                    abort_unless(in_array($report->status, ['open', 'under_review'], true), 409, 'Kasus tidak dapat meminta jawaban pada tahap ini.');
                    abort_unless($report->subject_user_id && $report->subject, 409, 'Pihak terlapor belum dapat ditentukan; periksa subjek secara manual.');
                    abort_unless(isset($data['summary'], $data['response_due_at']), 422, 'Ringkasan aman dan tenggat jawaban wajib diisi.');
                    $report->update(['status' => 'awaiting_response', 'subject_summary' => trim($data['summary']), 'response_due_at' => $data['response_due_at']]);
                    $eventBody = trim($data['summary']);
                    break;

                case 'decide':
                    abort_unless(isset($data['decision'], $data['reason']), 422, 'Keputusan dan alasan wajib diisi.');
                    abort_unless(in_array($report->status, ['open', 'under_review', 'awaiting_response'], true), 409, 'Kasus sudah mencapai keputusan akhir.');
                    $punitive = $data['decision'] !== 'no_action';
                    $hasResponse = $report->events()->where('event_type', 'subject_response')->exists();
                    abort_if($punitive && ! $report->subject_user_id, 409, 'Subjek laporan belum dapat ditentukan; kasus ini harus ditriase manual tanpa tindakan otomatis.');
                    abort_if($punitive && ($report->status !== 'awaiting_response' || (! $hasResponse && (! $report->response_due_at || $report->response_due_at->isFuture()))), 409, 'Minta jawaban pihak terlapor terlebih dahulu dan tunggu jawaban atau tenggatnya.');
                    if ($data['decision'] === 'hide_listing') {
                        abort_unless($listing && (int) $listing->owner_id === (int) $report->subject_user_id, 422, 'Listing yang ditindak harus milik pihak terlapor.');
                        abort_if(in_array($listing->status, [Listing::STATUS_COMPLETED, Listing::STATUS_REMOVED], true), 409, 'Listing selesai atau sudah dihapus tidak dapat disembunyikan.');
                        abort_unless($listing->moderation_status === Listing::MODERATION_ACTIVE || (int) $listing->moderation_case_id === (int) $report->id, 409, 'Listing sedang ditahan oleh kasus moderasi lain.');
                        $listing->update(['moderation_status' => Listing::MODERATION_HIDDEN, 'moderation_reason' => trim($data['reason']), 'moderation_case_id' => $report->id, 'moderation_changed_at' => now()]);
                    } elseif ($data['decision'] === 'restrict_account') {
                        abort_unless($report->subject, 422, 'Subjek laporan belum dapat ditentukan.');
                        abort_unless(! $report->subject->isModerationRestricted() || (int) $report->subject->moderation_case_id === (int) $report->id, 409, 'Akun sedang dibatasi oleh kasus lain; selesaikan atau tinjau kasus tersebut terlebih dahulu.');
                        $priorProven = Report::query()->where('subject_user_id', $report->subject_user_id)
                            ->where(fn ($query) => $query->where('status', 'resolved_action')->orWhere(fn ($appealed) => $appealed->where('status', 'appeal_resolved')->where('appeal_outcome', 'upheld')))
                            ->where('decision_action', '<>', 'no_action')->where(fn ($query) => $query->whereNull('appeal_outcome')->orWhere('appeal_outcome', '<>', 'overturned'))->where('id', '<>', $report->id)->exists();
                        abort_unless(($data['severe'] ?? false) || $priorProven, 422, 'Pembatasan akun hanya untuk kasus berat atau pelanggaran terbukti yang berulang.');
                        $report->subject->update(['moderation_status' => 'restricted', 'moderation_reason' => trim($data['reason']), 'moderation_case_id' => $report->id, 'restricted_at' => now()]);
                        Listing::query()->where('owner_id', $report->subject_user_id)
                            ->where('status', Listing::STATUS_PUBLISHED)
                            ->where('moderation_status', Listing::MODERATION_ACTIVE)
                            ->update(['moderation_status' => Listing::MODERATION_HIDDEN, 'moderation_reason' => trim($data['reason']), 'moderation_case_id' => $report->id, 'moderation_changed_at' => now()]);
                    }
                    $report->update([
                        'status' => $punitive ? 'resolved_action' : 'resolved_no_action',
                        'decision_action' => $data['decision'], 'decision_reason' => trim($data['reason']),
                        'reporter_outcome_summary' => isset($data['reporter_summary']) ? trim($data['reporter_summary']) : ($punitive ? 'Laporan ditindaklanjuti setelah peninjauan.' : 'Laporan ditinjau; bukti yang tersedia belum mendukung tindakan.'),
                        'decision_severe' => (bool) ($data['severe'] ?? false), 'decided_at' => now(),
                        'appeal_deadline_at' => $punitive ? now()->addDays(7) : null,
                    ]);
                    $eventType = 'decision_'.$data['decision'];
                    $eventBody = trim($data['reason']);
                    break;

                case 'hold_listing':
                    abort_unless($listing && $report->category === 'food_safety', 422, 'Penahanan sementara hanya untuk listing pada laporan keamanan pangan.');
                    abort_if(in_array($listing->status, [Listing::STATUS_COMPLETED, Listing::STATUS_REMOVED], true), 409, 'Listing selesai atau sudah dihapus tidak dapat ditahan.');
                    abort_unless($listing->moderation_status === Listing::MODERATION_ACTIVE || (int) $listing->moderation_case_id === (int) $report->id, 409, 'Listing sedang ditahan oleh kasus moderasi lain.');
                    abort_unless(isset($data['reason']), 422, 'Alasan penahanan wajib diisi.');
                    $listing->update(['moderation_status' => Listing::MODERATION_HIDDEN, 'moderation_reason' => trim($data['reason']), 'moderation_case_id' => $report->id, 'moderation_changed_at' => now()]);
                    $report->update(['emergency_hold_at' => now(), 'emergency_hold_reason' => trim($data['reason']), 'subject_summary' => trim($data['reason'])]);
                    $eventType = 'emergency_listing_hold';
                    $eventBody = trim($data['reason']);
                    break;

                case 'release_hold':
                    abort_unless($report->emergency_hold_at && $report->decision_action !== 'hide_listing' && $listing && (int) $listing->moderation_case_id === (int) $report->id && $listing->moderation_status === Listing::MODERATION_HIDDEN, 409, 'Listing tidak sedang ditahan sementara oleh kasus ini.');
                    $listing->update(['moderation_status' => Listing::MODERATION_ACTIVE, 'moderation_reason' => null, 'moderation_case_id' => null, 'moderation_changed_at' => now()]);
                    $report->update(['emergency_hold_at' => null, 'emergency_hold_reason' => null]);
                    $eventType = 'emergency_listing_hold_released';
                    break;

                case 'resolve_appeal':
                    abort_unless($report->status === 'appealed' && isset($data['appeal_outcome'], $data['reason']), 409, 'Banding belum tersedia untuk diputus.');
                    if ($data['appeal_outcome'] === 'overturned') {
                        if ($report->subject && (int) $report->subject->moderation_case_id === (int) $report->id) {
                            $report->subject->update(['moderation_status' => 'active', 'moderation_reason' => null, 'moderation_case_id' => null, 'restricted_at' => null]);
                        }
                        if ($listing && (int) $listing->moderation_case_id === (int) $report->id) {
                            $listing->update(['moderation_status' => Listing::MODERATION_ACTIVE, 'moderation_reason' => null, 'moderation_case_id' => null, 'moderation_changed_at' => now()]);
                        }
                        Listing::query()->where('owner_id', $report->subject_user_id)->where('moderation_case_id', $report->id)
                            ->update(['moderation_status' => Listing::MODERATION_ACTIVE, 'moderation_reason' => null, 'moderation_case_id' => null, 'moderation_changed_at' => now()]);
                    }
                    $report->update(['status' => 'appeal_resolved', 'appeal_outcome' => $data['appeal_outcome'], 'appeal_decision_reason' => trim($data['reason']), 'appeal_resolved_at' => now(), ...($data['appeal_outcome'] === 'overturned' ? ['emergency_hold_at' => null, 'emergency_hold_reason' => null] : [])]);
                    $eventType = 'appeal_'.$data['appeal_outcome'];
                    $eventBody = trim($data['reason']);
                    break;
            }

            $report->events()->create([
                'actor_id' => $admin->id,
                'event_type' => $eventType,
                'visibility' => in_array($data['action'], ['request_response', 'decide', 'hold_listing', 'release_hold', 'resolve_appeal'], true) ? 'subject_visible' : 'admin_only',
                'body' => $eventBody,
                'metadata' => ['status' => $report->status],
            ]);
            AdminAuditLog::query()->create([
                'admin_id' => $admin->id, 'actor_id' => $admin->id, 'actor_role' => $admin->role, 'actor_name' => $admin->name,
                'action' => 'report_'.$data['action'], 'entity_type' => 'report', 'entity_id' => (string) $report->id,
                'reason' => $data['reason'] ?? $data['summary'] ?? null,
                'before' => $before,
                'after' => ['status' => $report->status, 'decision_action' => $report->decision_action, 'listing_moderation' => $listing?->fresh()->moderation_status, 'subject_moderation' => $report->subject?->fresh()->moderation_status],
                'created_at' => now(),
            ]);

            return response()->json(['message' => 'Perubahan kasus berhasil disimpan.', 'report' => ['id' => $report->id, 'status' => $report->status]]);
        });
    }

    private function isParticipant(Report $report, User $user): bool
    {
        return (int) $report->reporter_id === (int) $user->id || (int) $report->subject_user_id === (int) $user->id;
    }

    private function eventVisibleTo(ReportEvent $event, Report $report, User $user): bool
    {
        if ($event->visibility === 'reporter_summary') {
            return (int) $report->reporter_id === (int) $user->id || (int) $report->subject_user_id === (int) $user->id;
        }

        return $event->visibility === 'subject_visible' && (int) $report->subject_user_id === (int) $user->id;
    }

    /** @return array<string, mixed> */
    private function caseData(Report $report, User $user): array
    {
        $isSubject = (int) $report->subject_user_id === (int) $user->id;
        $listing = $report->listing ?? $report->claim?->listing;

        return [
            'id' => $report->id,
            'category' => $report->category,
            'status' => $report->status,
            'created_at' => $report->created_at,
            'target_title' => $listing?->title,
            'business_name' => $listing?->business_name,
            'subject_summary' => $isSubject ? $report->subject_summary : null,
            'decision_action' => $isSubject ? $report->decision_action : null,
            'decision_reason' => $isSubject ? $report->decision_reason : null,
            'appeal_outcome' => $isSubject ? $report->appeal_outcome : null,
            'appeal_decision_reason' => $isSubject ? $report->appeal_decision_reason : null,
            'reporter_outcome_summary' => (int) $report->reporter_id === (int) $user->id ? $report->reporter_outcome_summary : null,
            'response_due_at' => $isSubject ? $report->response_due_at : null,
            'appeal_deadline_at' => $isSubject ? $report->appeal_deadline_at : null,
            'can_respond' => $isSubject && $report->status === 'awaiting_response' && (! $report->response_due_at || $report->response_due_at->isFuture()),
            'can_appeal' => $isSubject && $report->status === 'resolved_action' && $report->decision_action !== 'no_action' && ! $report->appealed_at && $report->appeal_deadline_at?->isFuture(),
        ];
    }
}
