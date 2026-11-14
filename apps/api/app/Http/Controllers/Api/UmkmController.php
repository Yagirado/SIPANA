<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Listing;
use App\Models\MasterDataItem;
use App\Models\Report;
use App\Models\UmkmProfile;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Throwable;

class UmkmController extends Controller
{
    public function __construct(
        private readonly ListingController $listings,
        private readonly AuditLogger $auditLogger,
    ) {}

    public function dashboard(Request $request): JsonResponse
    {
        $this->listings->expireDueRecords();
        $owner = $request->user();
        $listings = $owner->listings();
        $profile = $owner->umkmProfile;
        $monthStart = now('Asia/Jakarta')->startOfMonth()->utc();
        $nextMonthStart = $monthStart->copy()->addMonth();
        $nextClaim = Claim::query()->with(['listing', 'claimant'])
            ->whereHas('listing', fn ($query) => $query->where('owner_id', $owner->id))
            ->where('status', Claim::STATUS_ACTIVE)->orderBy('claimed_at')->first();

        return response()->json([
            'user' => [...$owner->only(['id', 'name', 'email', 'phone', 'role']), 'district' => MasterDataItem::labelFor('district', $owner->district)],
            'verification' => $this->verificationData($owner),
            'moderation' => ['status' => $owner->moderation_status ?? 'active', 'reason' => $owner->moderation_reason, 'restricted_at' => $owner->restricted_at],
            'terms' => ['accepted_at' => $profile?->terms_accepted_at, 'version' => $profile?->terms_version],
            'metrics' => [
                'active_listings' => (clone $listings)->where('status', Listing::STATUS_PUBLISHED)->where('moderation_status', Listing::MODERATION_ACTIVE)->count(),
                'incoming_claims' => (clone $listings)->where('status', Listing::STATUS_CLAIMED)->count(),
                'completed_handover' => (clone $listings)->where('status', Listing::STATUS_COMPLETED)->where('updated_at', '>=', $monthStart)->where('updated_at', '<', $nextMonthStart)->count(),
                'portions_distributed' => (clone $listings)->where('status', Listing::STATUS_COMPLETED)->where('updated_at', '>=', $monthStart)->where('updated_at', '<', $nextMonthStart)->sum('quantity'),
            ],
            'latest_listings' => (clone $listings)->with('claim.claimant')->latest()->limit(5)->get()->map(fn (Listing $listing) => $this->listingData($listing)),
            'next_claim' => $nextClaim ? $this->claimData($nextClaim) : null,
            'has_profile' => $profile !== null,
        ]);
    }

    public function listings(Request $request): JsonResponse
    {
        $this->listings->expireDueRecords();
        $filters = $request->validate([
            'status' => ['nullable', Rule::in([Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED, Listing::STATUS_COMPLETED, Listing::STATUS_EXPIRED, Listing::STATUS_WITHDRAWN, 'history'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
        $ownerListings = $request->user()->listings();
        $counts = (clone $ownerListings)->selectRaw('status, COUNT(*) as aggregate')->groupBy('status')->pluck('aggregate', 'status');
        $results = (clone $ownerListings)->with('claim.claimant')
            ->when(($filters['status'] ?? null) === 'history', fn ($query) => $query->whereIn('status', [Listing::STATUS_COMPLETED, Listing::STATUS_EXPIRED, Listing::STATUS_WITHDRAWN, Listing::STATUS_REMOVED]))
            ->when(isset($filters['status']) && $filters['status'] !== 'history', fn ($query) => $query->where('status', $filters['status']))
            ->latest()->paginate(12)->withQueryString();
        $results->getCollection()->transform(fn (Listing $listing) => $this->listingData($listing));
        $payload = $results->toArray();
        $payload['counts'] = [
            Listing::STATUS_PUBLISHED => (int) ($counts[Listing::STATUS_PUBLISHED] ?? 0),
            Listing::STATUS_CLAIMED => (int) ($counts[Listing::STATUS_CLAIMED] ?? 0),
            'history' => (int) ($counts[Listing::STATUS_COMPLETED] ?? 0) + (int) ($counts[Listing::STATUS_EXPIRED] ?? 0) + (int) ($counts[Listing::STATUS_WITHDRAWN] ?? 0) + (int) ($counts[Listing::STATUS_REMOVED] ?? 0),
        ];

        return response()->json($payload);
    }

    public function listing(Request $request, int $listingId): JsonResponse
    {
        $this->listings->expireDueRecords();
        $listing = $request->user()->listings()->with('claim.claimant')->findOrFail($listingId);

        return response()->json($this->listingData($listing));
    }

    public function storeListing(Request $request): JsonResponse
    {
        $this->ensureVerified($request);
        $data = $this->validateListing($request);
        $profile = $request->user()->umkmProfile;
        $acceptance = $profile->terms_accepted_at ? [] : $request->validate([
            'terms_accepted' => ['required', 'accepted'],
        ]);
        $photoPath = $request->file('photo')?->store('umkm/listings/'.$request->user()->id, [
            'disk' => 'b2-images',
            'visibility' => 'private',
        ]);
        if ($request->hasFile('photo') && ! $photoPath) {
            return response()->json(['message' => 'Foto listing gagal disimpan. Coba unggah kembali.'], 500);
        }
        try {
            $listing = DB::transaction(function () use ($request, $data, $profile, $acceptance, $photoPath): Listing {
                if (! $profile->terms_accepted_at && ($acceptance['terms_accepted'] ?? false)) {
                    $profile->update(['terms_accepted_at' => now(), 'terms_version' => '1.0']);
                }

                $listing = $request->user()->listings()->create([
                    ...$data,
                    ...($photoPath ? ['photo_path' => $photoPath] : []),
                    'business_name' => $profile->business_name,
                    'pickup_address' => $profile->business_address,
                    'safety_attested_at' => now(),
                    'status' => Listing::STATUS_PUBLISHED,
                ]);

                $this->auditLogger->record($request->user(), 'listing.created', 'listing', $listing->id, null, $this->listingAuditData($listing));

                return $listing;
            });
        } catch (Throwable $exception) {
            if ($photoPath) {
                Storage::disk('b2-images')->delete($photoPath);
            }

            throw $exception;
        }

        return response()->json(['message' => 'Listing berhasil dipublikasikan.', 'listing' => $this->listingData($listing)], 201);
    }

    public function updateListing(Request $request, int $listingId): JsonResponse
    {
        $this->ensureVerified($request);
        $listing = $request->user()->listings()->with('claim')->findOrFail($listingId);
        if ($listing->status !== Listing::STATUS_PUBLISHED || $listing->claim !== null) {
            return response()->json(['message' => 'Listing hanya dapat diubah sebelum diklaim.'], 409);
        }
        $data = $this->validateListing($request, $listing);
        $photoPath = $request->file('photo')?->store('umkm/listings/'.$request->user()->id, [
            'disk' => 'b2-images',
            'visibility' => 'private',
        ]);
        if ($request->hasFile('photo') && ! $photoPath) {
            return response()->json(['message' => 'Foto listing gagal disimpan. Coba unggah kembali.'], 500);
        }
        $previousPhotoPath = $listing->photo_path;
        $previousPhotoDisk = $photoPath && $previousPhotoPath ? $this->listingPhotoDisk($previousPhotoPath) : null;
        $before = $this->listingAuditData($listing);
        try {
            DB::transaction(function () use ($listing, $request, $data, $photoPath, $before): void {
                $listing->update([
                    ...$data,
                    ...($photoPath ? ['photo_path' => $photoPath] : []),
                    'safety_attested_at' => now(),
                ]);
                $this->auditLogger->record($request->user(), 'listing.updated', 'listing', $listing->id, $before, $this->listingAuditData($listing->fresh()));
            });
        } catch (Throwable $exception) {
            if ($photoPath) {
                Storage::disk('b2-images')->delete($photoPath);
            }

            throw $exception;
        }
        if ($photoPath && $previousPhotoDisk && $previousPhotoPath !== $photoPath) {
            Storage::disk($previousPhotoDisk)->delete($previousPhotoPath);
        }

        return response()->json(['message' => 'Perubahan listing berhasil disimpan.', 'listing' => $this->listingData($listing->fresh())]);
    }

    public function withdrawListing(Request $request, int $listingId): JsonResponse
    {
        $listing = $request->user()->listings()->with('claim')->findOrFail($listingId);
        if ($listing->status !== Listing::STATUS_PUBLISHED || $listing->claim !== null) {
            return response()->json(['message' => 'Listing hanya dapat ditarik sebelum diklaim.'], 409);
        }
        DB::transaction(function () use ($listing, $request): void {
            $before = $this->listingAuditData($listing);
            $listing->update(['status' => Listing::STATUS_WITHDRAWN]);
            $this->auditLogger->record($request->user(), 'listing.withdrawn', 'listing', $listing->id, $before, $this->listingAuditData($listing->fresh()));
        });

        return response()->json(['message' => 'Listing ditarik dari publik.']);
    }

    public function claims(Request $request): JsonResponse
    {
        $this->listings->expireDueRecords();
        $results = Claim::query()->with(['listing', 'claimant'])
            ->whereHas('listing', fn ($query) => $query->where('owner_id', $request->user()->id))
            ->latest('claimed_at')->paginate(12);
        $results->getCollection()->transform(fn (Claim $claim) => $this->claimData($claim));

        return response()->json($results);
    }

    public function claim(Request $request, int $claimId): JsonResponse
    {
        $this->listings->expireDueRecords();
        $claim = Claim::query()->with(['listing', 'claimant'])
            ->whereHas('listing', fn ($query) => $query->where('owner_id', $request->user()->id))
            ->findOrFail($claimId);

        return response()->json($this->claimData($claim));
    }

    public function confirmHandover(Request $request, int $claimId): JsonResponse
    {
        $this->listings->expireDueRecords();
        try {
            $claim = DB::transaction(function () use ($request, $claimId): Claim {
                $claim = Claim::query()->with('listing')->lockForUpdate()
                    ->whereHas('listing', fn ($query) => $query->where('owner_id', $request->user()->id))
                    ->findOrFail($claimId);
                $listing = Listing::query()->lockForUpdate()->findOrFail($claim->listing_id);

                if ($claim->status !== Claim::STATUS_ACTIVE || $listing->status !== Listing::STATUS_CLAIMED) {
                    throw new ConflictHttpException('Klaim ini sudah ditutup atau kedaluwarsa.');
                }

                $claim->update(['status' => Claim::STATUS_COMPLETED, 'completed_at' => now()]);
                $listing->update(['status' => Listing::STATUS_COMPLETED]);
                $this->auditLogger->record(
                    $request->user(),
                    'handover.confirmed',
                    'claim',
                    $claim->id,
                    ['claim_status' => Claim::STATUS_ACTIVE, 'listing_status' => Listing::STATUS_CLAIMED],
                    ['claim_status' => $claim->status, 'listing_status' => $listing->status, 'listing_id' => $listing->id, 'portions' => $listing->quantity, 'completed_at' => $claim->completed_at?->toIso8601String()],
                );

                return $claim->fresh(['listing', 'claimant']);
            });
        } catch (ConflictHttpException $exception) {
            return response()->json(['message' => $exception->getMessage()], 409);
        }

        return response()->json(['message' => 'Serah terima berhasil dikonfirmasi.', 'claim' => $this->claimData($claim)]);
    }

    public function storeClaimReport(Request $request, int $claimId): JsonResponse
    {
        $data = $request->validate([
            'category' => ['required', Rule::in(['food_safety', 'misrepresentation', 'inappropriate_behavior', 'other'])],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);
        $claim = Claim::query()->with('claimant')->whereHas('listing', fn ($query) => $query->where('owner_id', $request->user()->id))->findOrFail($claimId);
        $report = Report::query()->create([
            'reporter_id' => $request->user()->id,
            'subject_user_id' => $claim->claimant_id,
            'listing_id' => $claim->listing_id,
            'claim_id' => $claim->id,
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
        ]);

        return response()->json(['message' => 'Kendala berhasil dilaporkan.', 'report' => ['id' => $report->id, 'status' => $report->status]], 201);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json($this->profileData($request->user()));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->merge(['phone' => preg_replace('/[\s()-]/', '', (string) $request->input('phone'))]);
        $owner = $request->user();
        $profile = $owner->umkmProfile;
        abort_unless($profile, 404, 'Profil usaha belum tersedia.');
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\\+62|0)8\\d{7,11}$/', 'max:20'],
            'business_name' => ['required', 'string', 'min:2', 'max:160'],
            'business_type' => ['required', 'string', 'max:80'],
            'district' => ['required', Rule::in(array_values(array_unique([...MasterDataItem::activeKeys('district', true), $owner->district])))],
            'business_address' => ['required', 'string', 'min:5', 'max:1000'],
            'business_proof' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);
        $proofPath = $request->file('business_proof')?->store('umkm/business-proofs', 'b2-documents');
        $previousProofPath = $profile->business_proof_path;
        $previousProofDisk = $proofPath && $previousProofPath ? $this->proofDisk($previousProofPath) : null;
        $identityChanged = $profile->business_name !== $data['business_name']
            || $profile->business_type !== $data['business_type']
            || $profile->business_address !== $data['business_address']
            || $owner->name !== $data['name']
            || $owner->district !== $data['district']
            || $proofPath !== null;
        try {
            DB::transaction(function () use ($owner, $profile, $data, $identityChanged, $proofPath): void {
                $owner->update(['name' => $data['name'], 'phone' => $data['phone'], 'district' => $data['district']]);
                $profile->update([
                    'business_name' => $data['business_name'],
                    'business_type' => $data['business_type'],
                    'business_address' => $data['business_address'],
                    ...($proofPath ? ['business_proof_path' => $proofPath] : []),
                    ...($identityChanged ? ['verification_status' => UmkmProfile::STATUS_PENDING, 'verification_reason' => null] : []),
                ]);
                if ($identityChanged) {
                    $owner->forceFill(['umkm_verified_at' => null])->save();
                }
            });
        } catch (Throwable $exception) {
            if ($proofPath) {
                Storage::disk('b2-documents')->delete($proofPath);
            }

            throw $exception;
        }
        if ($proofPath && $previousProofDisk && $previousProofPath !== $proofPath) {
            Storage::disk($previousProofDisk)->delete($previousProofPath);
        }

        return response()->json([
            'message' => $identityChanged ? 'Profil diperbarui dan perlu diperiksa kembali sebelum listing baru dapat diterbitkan.' : 'Profil usaha berhasil diperbarui.',
            'profile' => $this->profileData($owner->fresh()),
        ]);
    }

    public function impact(Request $request): JsonResponse
    {
        $month = $request->validate(['month' => ['nullable', 'date_format:Y-m']])['month'] ?? now('Asia/Jakarta')->format('Y-m');
        $localStart = Carbon::createFromFormat('!Y-m', $month, 'Asia/Jakarta');
        $localEnd = $localStart->copy()->endOfMonth();
        $start = $localStart->copy()->utc();
        $end = $localEnd->copy()->utc();
        $completed = $request->user()->listings()->where('status', Listing::STATUS_COMPLETED)
            ->whereBetween('updated_at', [$start, $end]);

        $weeklyPortions = collect();
        $cursor = $localStart->copy();
        $week = 1;
        while ($cursor->lte($localEnd)) {
            $weekEnd = $cursor->copy()->addDays(6)->endOfDay()->min($localEnd);
            $weeklyPortions->push([
                'week' => $week++,
                'portions' => $request->user()->listings()->where('status', Listing::STATUS_COMPLETED)
                    ->whereBetween('updated_at', [$cursor->copy()->utc(), $weekEnd->copy()->utc()])->sum('quantity'),
            ]);
            $cursor = $weekEnd->copy()->addSecond()->startOfDay();
        }

        return response()->json([
            'month' => $month,
            'published_listings' => (clone $request->user()->listings())->whereBetween('created_at', [$start, $end])->count(),
            'claims' => Claim::query()->whereHas('listing', fn ($query) => $query->where('owner_id', $request->user()->id))
                ->whereBetween('claimed_at', [$start, $end])->count(),
            'completed_handovers' => (clone $completed)->count(),
            'portions_distributed' => (clone $completed)->sum('quantity'),
            'weekly_portions' => $weeklyPortions,
        ]);
    }

    /** @return array<string, mixed> */
    private function validateListing(Request $request, ?Listing $existingListing = null): array
    {
        $allowedDistricts = MasterDataItem::activeKeys('district', true);
        $allowedPurposes = MasterDataItem::activeKeys('purpose');
        if ($existingListing) {
            $allowedDistricts[] = $existingListing->district;
            $allowedPurposes[] = $existingListing->purpose;
        }
        $data = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'quantity' => ['required', 'integer', 'min:1', 'max:65535'],
            'prepared_at' => ['required', 'date', 'before_or_equal:now'],
            'pickup_starts_at' => ['required', 'date', 'after_or_equal:now'],
            'pickup_ends_at' => ['required', 'date', 'after:pickup_starts_at'],
            'purpose' => ['required', Rule::in(array_values(array_unique($allowedPurposes)))],
            'district' => ['required', Rule::in(array_values(array_unique($allowedDistricts)))],
            'safety_attested' => ['required', 'accepted'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);
        unset($data['safety_attested']);
        unset($data['photo']);

        return $data;
    }

    private function ensureVerified(Request $request): void
    {
        abort_unless(! $request->user()->isModerationRestricted(), 403, 'Akun sedang dibatasi berdasarkan keputusan moderasi. Anda tetap dapat membuka kasus, menjawab, dan mengajukan banding.');
        abort_unless($request->user()->umkm_verified_at !== null, 403, 'Akun usaha belum terverifikasi. Periksa status verifikasi sebelum menerbitkan listing.');
    }

    /** @return array<string, mixed> */
    private function verificationData($owner): array
    {
        $profile = $owner->umkmProfile;
        return [
            'status' => $owner->umkm_verified_at ? 'verified' : ($profile?->verification_status ?? UmkmProfile::STATUS_PENDING),
            'reason' => $profile?->verification_reason,
            'verified_at' => $owner->umkm_verified_at,
        ];
    }

    /** @return array<string, mixed> */
    private function profileData($owner): array
    {
        $profile = $owner->umkmProfile;
        return [
            'name' => $owner->name,
            'email' => $owner->email,
            'phone' => $owner->phone,
            'district' => MasterDataItem::labelFor('district', $owner->district),
            'district_key' => $owner->district,
            'business_name' => $profile?->business_name,
            'business_type' => $profile?->business_type,
            'business_address' => $profile?->business_address,
            'verification' => $this->verificationData($owner),
            'proof_submitted' => $profile?->business_proof_path !== null,
            'terms' => ['accepted_at' => $profile?->terms_accepted_at, 'version' => $profile?->terms_version],
        ];
    }

    /** @return array<string, mixed> */
    private function listingData(Listing $listing): array
    {
        return [
            'id' => $listing->id, 'business_name' => $listing->business_name, 'title' => $listing->title,
            'description' => $listing->description, 'quantity' => $listing->quantity, 'prepared_at' => $listing->prepared_at,
            'pickup_starts_at' => $listing->pickup_starts_at, 'pickup_ends_at' => $listing->pickup_ends_at,
            'purpose' => $listing->purpose, 'purpose_label' => MasterDataItem::labelFor('purpose', $listing->purpose),
            'district' => MasterDataItem::labelFor('district', $listing->district), 'district_key' => $listing->district, 'pickup_address' => $listing->pickup_address,
            'status' => $listing->status,
            'moderation_status' => $listing->moderation_status,
            'moderation_reason' => $listing->moderation_reason,
            'image_url' => $listing->photo_path ? route('listings.image', ['listingId' => $listing->id], false) : null,
            'claimed_by' => $listing->claim?->claimant?->name,
            'claim_id' => $listing->claim?->id,
        ];
    }

    private function proofDisk(string $path): ?string
    {
        foreach (['b2-documents', 'local'] as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                return $disk;
            }
        }

        return null;
    }

    private function listingPhotoDisk(string $path): ?string
    {
        foreach (['b2-images', 'public'] as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                return $disk;
            }
        }

        return null;
    }

    /** @return array<string, mixed> */
    private function listingAuditData(Listing $listing): array
    {
        return [
            'title' => $listing->title,
            'quantity' => $listing->quantity,
            'purpose' => $listing->purpose,
            'district' => $listing->district,
            'status' => $listing->status,
            'prepared_at' => $listing->prepared_at?->toIso8601String(),
            'pickup_starts_at' => $listing->pickup_starts_at?->toIso8601String(),
            'pickup_ends_at' => $listing->pickup_ends_at?->toIso8601String(),
        ];
    }

    /** @return array<string, mixed> */
    private function claimData(Claim $claim): array
    {
        return [
            'id' => $claim->id,
            'status' => $claim->status,
            'claimed_at' => $claim->claimed_at,
            'completed_at' => $claim->completed_at,
            'claimant' => ['id' => $claim->claimant->id, 'name' => $claim->claimant->name, 'phone' => $claim->claimant->phone],
            'listing' => $this->listingData($claim->listing),
        ];
    }
}
