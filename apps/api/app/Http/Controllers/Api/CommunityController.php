<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCommunityReportRequest;
use App\Http\Requests\Api\UpdateCommunityProfileRequest;
use App\Models\Claim;
use App\Models\Listing;
use App\Models\MasterDataItem;
use App\Models\Report;
use App\Services\AuditLogger;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class CommunityController extends Controller
{
    public function __construct(
        private readonly ListingController $listings,
        private readonly AuditLogger $auditLogger,
    ) {}

    public function dashboard(Request $request): JsonResponse
    {
        $this->listings->expireDueRecords();
        $member = $request->user();
        $latestListings = Listing::query()->available()->latest('created_at')->limit(4)->get();

        return response()->json([
            'user' => [...$member->only(['id', 'name', 'email', 'role']), 'district' => MasterDataItem::labelFor('district', $member->district)],
            'available_listings' => Listing::query()->available()->count(),
            'active_claims' => Claim::query()->where('claimant_id', $member->id)->where('status', Claim::STATUS_ACTIVE)->count(),
            'latest_listings' => $latestListings->map(fn (Listing $listing) => [
                'id' => $listing->id,
                'business_name' => $listing->business_name,
                'title' => $listing->title,
                'quantity' => $listing->quantity,
                'pickup_ends_at' => $listing->pickup_ends_at,
                'purpose' => $listing->purpose,
                'purpose_label' => MasterDataItem::labelFor('purpose', $listing->purpose),
                'district' => MasterDataItem::labelFor('district', $listing->district),
                'district_key' => $listing->district,
                'verified' => true,
            ]),
        ]);
    }

    public function storeClaim(Request $request, int $listingId): JsonResponse
    {
        $this->listings->expireDueRecords();
        abort_unless(! $request->user()->isModerationRestricted(), 403, 'Akun sedang dibatasi berdasarkan keputusan moderasi. Klaim baru belum dapat dibuat.');

        try {
            $claim = DB::transaction(function () use ($request, $listingId): Claim {
                $listing = Listing::query()->lockForUpdate()->findOrFail($listingId);

                if (! $listing->owner?->hasRole('umkm') || $listing->owner?->umkm_verified_at === null) {
                    throw new ConflictHttpException('Listing dari UMKM terverifikasi tidak ditemukan.');
                }

                if ($listing->status !== Listing::STATUS_PUBLISHED || $listing->moderation_status !== Listing::MODERATION_ACTIVE || $listing->owner?->isModerationRestricted() || $listing->pickup_ends_at->isPast()) {
                    throw new ConflictHttpException('Listing ini sudah tidak tersedia untuk diklaim.');
                }

                $claim = Claim::query()->create([
                    'listing_id' => $listing->id,
                    'claimant_id' => $request->user()->id,
                    'status' => Claim::STATUS_ACTIVE,
                    'claimed_at' => now(),
                ]);

                $listing->update(['status' => Listing::STATUS_CLAIMED]);
                $this->auditLogger->record(
                    $request->user(),
                    'claim.created',
                    'claim',
                    $claim->id,
                    null,
                    ['listing_id' => $listing->id, 'claimant_id' => $request->user()->id, 'status' => $claim->status, 'claimed_at' => $claim->claimed_at?->toIso8601String()],
                );

                return $claim->load('listing', 'listing.owner');
            });
        } catch (ConflictHttpException $exception) {
            return response()->json(['message' => $exception->getMessage()], 409);
        } catch (QueryException $exception) {
            if ($exception->getCode() === '23000') {
                return response()->json(['message' => 'Listing ini sudah diklaim oleh anggota lain.'], 409);
            }

            throw $exception;
        }

        return response()->json(['message' => 'Klaim berhasil dibuat.', 'claim' => $this->claimData($claim, true)], 201);
    }

    public function claims(Request $request): JsonResponse
    {
        $this->listings->expireDueRecords();
        $claims = Claim::query()
            ->with('listing', 'listing.owner')
            ->where('claimant_id', $request->user()->id)
            ->latest('claimed_at')
            ->paginate(15);

        $claims->getCollection()->transform(fn (Claim $claim) => $this->claimData($claim));

        return response()->json($claims);
    }

    public function claim(Request $request, int $claimId): JsonResponse
    {
        $this->listings->expireDueRecords();
        $claim = Claim::query()
            ->with('listing', 'listing.owner')
            ->where('claimant_id', $request->user()->id)
            ->findOrFail($claimId);

        return response()->json($this->claimData($claim, $claim->status === Claim::STATUS_ACTIVE));
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json($this->profileData($request->user()));
    }

    public function updateProfile(UpdateCommunityProfileRequest $request): JsonResponse
    {
        $member = $request->user();
        $member->fill($request->validated())->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'profile' => $this->profileData($member->fresh()),
        ]);
    }

    public function reports(Request $request): JsonResponse
    {
        $reports = Report::query()
            ->with('listing:id,title', 'claim.listing:id,title')
            ->where('reporter_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        $reports->getCollection()->transform(fn (Report $report) => [
            'id' => $report->id,
            'category' => $report->category,
            'description' => $report->description,
            'status' => $report->status,
            'reporter_outcome_summary' => $report->reporter_outcome_summary,
            'created_at' => $report->created_at,
            'target_title' => $report->listing?->title ?? $report->claim?->listing?->title,
        ]);

        return response()->json($reports);
    }

    public function storeReport(StoreCommunityReportRequest $request): JsonResponse
    {
        $data = $request->validated();
        $subjectId = null;
        $listingId = $data['listing_id'] ?? null;

        if (isset($data['claim_id'])) {
            $claim = Claim::query()->with('listing')
                ->whereKey($data['claim_id'])
                ->where('claimant_id', $request->user()->id)
                ->first();

            if (! $claim) {
                return response()->json(['message' => 'Klaim yang dilaporkan tidak ditemukan.'], 404);
            }
            $listingId = $claim->listing_id;
            $subjectId = $claim->listing?->owner_id;
        } elseif (isset($listingId)) {
            $listing = Listing::query()->findOrFail($listingId);
            $subjectId = $listing->owner_id;
        }

        if (! $subjectId || (int) $subjectId === (int) $request->user()->id) {
            return response()->json(['message' => 'Pihak terlapor tidak dapat ditentukan dari objek ini.'], 422);
        }

        $report = Report::query()->create([
            'reporter_id' => $request->user()->id,
            'subject_user_id' => $subjectId,
            'listing_id' => $listingId,
            'claim_id' => $data['claim_id'] ?? null,
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'report' => ['id' => $report->id, 'status' => $report->status],
        ], 201);
    }

    /** @return array<string, mixed> */
    private function profileData($member): array
    {
        return [
            ...$member->only(['id', 'name', 'email', 'phone', 'gender']),
            'district' => MasterDataItem::labelFor('district', $member->district),
            'district_key' => $member->district,
            'birth_date' => $member->birth_date?->format('Y-m-d'),
        ];
    }

    /** @return array<string, mixed> */
    private function claimData(Claim $claim, bool $includePickupContact = false): array
    {
        return [
            'id' => $claim->id,
            'status' => $claim->status,
            'claimed_at' => $claim->claimed_at,
            'completed_at' => $claim->completed_at,
            'listing' => [
                'id' => $claim->listing->id,
                'business_name' => $claim->listing->business_name,
                'business_contact' => $includePickupContact ? $claim->listing->owner?->phone : null,
                'title' => $claim->listing->title,
                'description' => $claim->listing->description,
                'quantity' => $claim->listing->quantity,
                'prepared_at' => $claim->listing->prepared_at,
                'pickup_starts_at' => $claim->listing->pickup_starts_at,
                'pickup_ends_at' => $claim->listing->pickup_ends_at,
                'purpose' => $claim->listing->purpose,
                'purpose_label' => MasterDataItem::labelFor('purpose', $claim->listing->purpose),
                'district' => MasterDataItem::labelFor('district', $claim->listing->district),
                'district_key' => $claim->listing->district,
                'pickup_address' => $claim->listing->pickup_address,
            ],
        ];
    }
}
