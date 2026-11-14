<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Claim;
use App\Models\Listing;
use App\Models\Report;
use App\Models\MasterDataItem;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function reports(Request $request): JsonResponse
    {
        $filters = $request->validate(['page' => ['nullable', 'integer', 'min:1']]);
        $reports = Report::query()
            ->with(['reporter:id,name,email', 'subject:id,name,email,moderation_status', 'listing:id,owner_id,title,business_name,district,moderation_status', 'claim.listing:id,owner_id,title,business_name,district,moderation_status'])
            ->latest()
            ->paginate(20, ['*'], 'page', $filters['page'] ?? 1)
            ->withQueryString();
        $reports->getCollection()->transform(fn (Report $report) => $this->reportData($report));

        return response()->json($reports);
    }

    public function report(int $reportId): JsonResponse
    {
        $report = Report::query()
            ->with(['reporter:id,name,email', 'subject:id,name,email,moderation_status', 'events' => fn ($query) => $query->with('actor:id,name')->orderBy('created_at'), 'listing:id,owner_id,title,business_name,district,moderation_status', 'claim.listing:id,owner_id,title,business_name,district,moderation_status'])
            ->findOrFail($reportId);

        return response()->json([
            ...$this->reportData($report, true),
            'reporter' => $report->reporter ? ['id' => $report->reporter->id, 'name' => $report->reporter->name, 'email' => $report->reporter->email] : null,
            'subject' => $report->subject ? ['id' => $report->subject->id, 'name' => $report->subject->name, 'email' => $report->subject->email, 'moderation_status' => $report->subject->moderation_status] : null,
            'target_claimant_id' => $report->claim?->claimant_id,
            'subject_summary' => $report->subject_summary,
            'response_due_at' => $report->response_due_at,
            'decision_action' => $report->decision_action,
            'decision_reason' => $report->decision_reason,
            'appeal_reason' => $report->appeal_reason,
            'appeal_outcome' => $report->appeal_outcome,
            'appeal_decision_reason' => $report->appeal_decision_reason,
            'appeal_deadline_at' => $report->appeal_deadline_at,
            'emergency_hold_at' => $report->emergency_hold_at,
            'events' => $report->events->map(fn ($event) => ['type' => $event->event_type, 'visibility' => $event->visibility, 'body' => $event->body, 'actor' => $event->actor?->name, 'created_at' => $event->created_at]),
        ]);
    }

    public function verifications(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'verified', 'rejected'])],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
        $users = User::query()->with('umkmProfile')
            ->where('role', User::ROLE_UMKM)
            ->whereHas('umkmProfile')
            ->when($filters['status'] ?? 'pending', function ($query, string $status): void {
                if ($status === 'verified') {
                    $query->whereNotNull('umkm_verified_at');
                } else {
                    $query->whereNull('umkm_verified_at')->whereHas('umkmProfile', fn ($profile) => $profile->where('verification_status', $status));
                }
            })
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(fn ($query) => $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('umkmProfile', fn ($profile) => $profile->where('business_name', 'like', "%{$search}%")));
            })
            ->latest('id')->paginate(20)->withQueryString();
        $users->getCollection()->transform(fn (User $user) => $this->verificationData($user));

        return response()->json($users);
    }

    public function verification(int $applicationId): JsonResponse
    {
        $user = User::query()->with('umkmProfile')->where('role', User::ROLE_UMKM)->findOrFail($applicationId);
        abort_unless($user->umkmProfile, 404, 'Data pengajuan usaha tidak ditemukan.');

        return response()->json($this->verificationData($user, true));
    }

    public function verificationDocument(int $applicationId)
    {
        $user = User::query()->with('umkmProfile')->where('role', User::ROLE_UMKM)->findOrFail($applicationId);
        $path = $user->umkmProfile?->business_proof_path;
        abort_unless($path, 404, 'Dokumen usaha tidak tersedia.');

        if (Storage::disk('b2-documents')->exists($path)) {
            return Storage::disk('b2-documents')->response($path, basename($path), [
                'Cache-Control' => 'private, no-store',
                'X-Content-Type-Options' => 'nosniff',
            ], 'inline');
        }

        abort_unless(Storage::disk('local')->exists($path), 404, 'Berkas dokumen usaha tidak ditemukan.');

        return response()->file(Storage::disk('local')->path($path), [
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    public function decideVerification(Request $request, int $applicationId): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['verified', 'rejected'])],
            'reason' => ['required_if:status,rejected', 'nullable', 'string', 'min:5', 'max:1000'],
        ]);
        $user = User::query()->with('umkmProfile')->where('role', User::ROLE_UMKM)->findOrFail($applicationId);
        abort_unless($user->umkmProfile, 404, 'Data pengajuan usaha tidak ditemukan.');

        $before = [
            'status' => $user->umkm_verified_at ? 'verified' : ($user->umkmProfile?->verification_status ?? 'pending'),
            'reason' => $user->umkmProfile?->verification_reason,
        ];
        DB::transaction(function () use ($request, $user, $data, $before): void {
            $approved = $data['status'] === 'verified';
            $user->forceFill(['umkm_verified_at' => $approved ? now() : null])->save();
            $user->umkmProfile->update([
                'verification_status' => $data['status'],
                'verification_reason' => $approved ? null : $data['reason'],
            ]);
            AdminAuditLog::query()->create([
                'admin_id' => $request->user()->id,
                'actor_id' => $request->user()->id,
                'actor_role' => $request->user()->role,
                'actor_name' => $request->user()->name,
                'action' => 'umkm_verification.'.$data['status'],
                'entity_type' => 'umkm_verification',
                'entity_id' => (string) $user->id,
                'reason' => $approved ? null : $data['reason'],
                'before' => $before,
                'after' => ['status' => $data['status'], 'reason' => $approved ? null : $data['reason']],
            ]);
        });

        return response()->json([
            'message' => $data['status'] === 'verified' ? 'UMKM berhasil diverifikasi.' : 'Pengajuan UMKM ditolak dengan alasan yang tercatat.',
            'application' => $this->verificationData($user->fresh('umkmProfile'), true),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', Rule::in(User::ROLES)],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, string $role) => $query->where('role', $role))
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return response()->json($users);
    }

    public function metrics(): JsonResponse
    {
        $roleCounts = User::query()
            ->selectRaw('role, COUNT(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role');
        $listingStatuses = Listing::query()->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');
        $claimStatuses = Claim::query()->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');
        $districtLabels = MasterDataItem::query()->where('type', 'district')->pluck('label', 'key');
        $listingsByDistrict = Listing::query()
            ->selectRaw('district, COUNT(*) as total')
            ->groupBy('district')
            ->orderByDesc('total')
            ->orderBy('district')
            ->get()
            ->map(fn (Listing $listing) => [
                'key' => $listing->district,
                'label' => $districtLabels[$listing->district] ?? $listing->district,
                'count' => (int) $listing->total,
            ])
            ->values();

        return response()->json([
            'total_users' => (int) User::query()->count(),
            'users_by_role' => collect(User::ROLES)
                ->mapWithKeys(fn (string $role) => [$role => (int) ($roleCounts[$role] ?? 0)]),
            'new_users_last_30_days' => (int) User::query()
                ->where('created_at', '>=', now()->subDays(30))
                ->count(),
            'listings' => [
                'total' => (int) Listing::query()->count(),
                'by_district' => $listingsByDistrict,
                ...collect([Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED, Listing::STATUS_COMPLETED, Listing::STATUS_EXPIRED, Listing::STATUS_WITHDRAWN, Listing::STATUS_REMOVED])
                    ->mapWithKeys(fn (string $status) => [$status => (int) ($listingStatuses[$status] ?? 0)])->all(),
                'portions_distributed' => (int) Listing::query()->where('status', Listing::STATUS_COMPLETED)->sum('quantity'),
            ],
            'claims' => [
                'total' => (int) Claim::query()->count(),
                ...collect([Claim::STATUS_ACTIVE, Claim::STATUS_COMPLETED, Claim::STATUS_EXPIRED])
                    ->mapWithKeys(fn (string $status) => [$status => (int) ($claimStatuses[$status] ?? 0)])->all(),
            ],
            'open_reports' => (int) Report::query()->whereIn('status', Report::OPEN_STATUSES)->count(),
            'pending_verifications' => (int) User::query()->where('role', User::ROLE_UMKM)
                ->whereNull('umkm_verified_at')->whereHas('umkmProfile', fn ($query) => $query->where('verification_status', UmkmProfile::STATUS_PENDING))->count(),
            'generated_at' => now()->toIso8601String(),
        ]);
    }

    /** @return array<string, mixed> */
    private function verificationData(User $user, bool $includeDetails = false): array
    {
        $profile = $user->umkmProfile;
        $data = [
            'id' => $user->id,
            'owner' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'business_name' => $profile?->business_name,
            'business_type' => $profile?->business_type,
            'district' => MasterDataItem::labelFor('district', $user->district),
            'business_address' => $profile?->business_address,
            'status' => $user->umkm_verified_at ? 'verified' : ($profile?->verification_status ?? 'pending'),
            'reason' => $profile?->verification_reason,
            'submitted_at' => $profile?->created_at,
        ];

        if ($includeDetails) {
            $data['document_url'] = route('admin.umkm-verification-document', ['applicationId' => $user->id], false);
            $data['verified_at'] = $user->umkm_verified_at;
        }

        return $data;
    }

    /** @return array<string, mixed> */
    private function reportData(Report $report, bool $includeDescription = false): array
    {
        $listing = $report->listing ?? $report->claim?->listing;

        return [
            'id' => $report->id,
            'category' => $report->category,
            'status' => $report->status,
            'subject_name' => $report->subject?->name,
            'target_owner_id' => $listing?->owner_id,
            'created_at' => $report->created_at,
            'target_type' => $report->claim_id ? 'claim' : 'listing',
            'target_title' => $listing?->title,
            'business_name' => $listing?->business_name,
            'district' => MasterDataItem::labelFor('district', $listing?->district),
            ...($includeDescription ? ['description' => $report->description] : []),
        ];
    }
}
