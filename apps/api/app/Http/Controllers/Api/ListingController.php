<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Listing;
use App\Models\MasterDataItem;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{
    public function __construct(private readonly AuditLogger $auditLogger) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'district' => ['nullable', Rule::in(MasterDataItem::activeKeys('district', true))],
            'purpose' => ['nullable', Rule::in(MasterDataItem::activeKeys('purpose'))],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $this->expireDueRecords();

        $listings = Listing::query()
            ->available()
            ->when($filters['district'] ?? null, fn ($query, string $district) => $query->where('district', $district))
            ->when($filters['purpose'] ?? null, fn ($query, string $purpose) => $query->where('purpose', $purpose))
            ->latest('created_at')
            ->paginate(12)
            ->withQueryString();

        $listings->getCollection()->transform(fn (Listing $listing) => $this->publicData($listing));

        return response()->json($listings);
    }

    public function show(int $listingId): JsonResponse
    {
        $this->expireDueRecords();

        $listing = Listing::query()
            ->whereHas('owner', fn ($owner) => $owner->where('role', 'umkm')->whereNotNull('umkm_verified_at'))
            ->where('moderation_status', Listing::MODERATION_ACTIVE)
            ->whereIn('status', [Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED, Listing::STATUS_EXPIRED])
            ->findOrFail($listingId);

        return response()->json($this->publicData($listing));
    }

    public function image(int $listingId)
    {
        $listing = Listing::query()
            ->whereHas('owner', fn ($owner) => $owner->where('role', 'umkm')->whereNotNull('umkm_verified_at'))
            ->where('moderation_status', Listing::MODERATION_ACTIVE)
            ->whereIn('status', [Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED, Listing::STATUS_EXPIRED])
            ->findOrFail($listingId);
        abort_unless($listing->photo_path, 404, 'Foto listing tidak tersedia.');

        $images = Storage::disk('b2-images');
        if ($images->exists($listing->photo_path)) {
            return $images->response($listing->photo_path, basename($listing->photo_path), [
                'Cache-Control' => 'private, max-age=300',
                'X-Content-Type-Options' => 'nosniff',
            ], 'inline');
        }

        abort_unless(Storage::disk('public')->exists($listing->photo_path), 404, 'Berkas foto listing tidak ditemukan.');

        return Storage::disk('public')->response($listing->photo_path, basename($listing->photo_path), [
            'Cache-Control' => 'private, max-age=300',
            'X-Content-Type-Options' => 'nosniff',
        ], 'inline');
    }

    public function expireDueRecords(): void
    {
        $now = now();

        Listing::query()
            ->whereIn('status', [Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED])
            ->where('pickup_ends_at', '<=', $now)
            ->orderBy('id')
            ->chunkById(100, function ($candidates) use ($now): void {
                DB::transaction(function () use ($candidates, $now): void {
                    $listings = Listing::query()
                        ->whereIn('id', $candidates->modelKeys())
                        ->whereIn('status', [Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED])
                        ->where('pickup_ends_at', '<=', $now)
                        ->lockForUpdate()
                        ->get();

                    foreach ($listings as $listing) {
                        $before = ['status' => $listing->status];
                        $listing->update(['status' => Listing::STATUS_EXPIRED, 'updated_at' => $now]);
                        $this->auditLogger->recordSystem(
                            'listing.expired',
                            'listing',
                            $listing->id,
                            $before,
                            ['status' => $listing->status],
                            'Waktu pengambilan telah berakhir.',
                        );
                    }
                });
            });

        Claim::query()
            ->where('status', Claim::STATUS_ACTIVE)
            ->whereHas('listing', fn ($query) => $query->where('pickup_ends_at', '<=', $now))
            ->orderBy('id')
            ->chunkById(100, function ($candidates) use ($now): void {
                DB::transaction(function () use ($candidates, $now): void {
                    $claims = Claim::query()
                        ->whereIn('id', $candidates->modelKeys())
                        ->where('status', Claim::STATUS_ACTIVE)
                        ->whereHas('listing', fn ($query) => $query->where('pickup_ends_at', '<=', $now))
                        ->lockForUpdate()
                        ->get();

                    foreach ($claims as $claim) {
                        $before = ['status' => $claim->status];
                        $claim->update(['status' => Claim::STATUS_EXPIRED, 'updated_at' => $now]);
                        $this->auditLogger->recordSystem(
                            'claim.expired',
                            'claim',
                            $claim->id,
                            $before,
                            ['status' => $claim->status, 'listing_id' => $claim->listing_id],
                            'Waktu pengambilan listing telah berakhir.',
                        );
                    }
                });
            });
    }

    /** @return array<string, mixed> */
    private function publicData(Listing $listing): array
    {
        return [
            'id' => $listing->id,
            'business_name' => $listing->business_name,
            'title' => $listing->title,
            'description' => $listing->description,
            'quantity' => $listing->quantity,
            'prepared_at' => $listing->prepared_at,
            'pickup_starts_at' => $listing->pickup_starts_at,
            'pickup_ends_at' => $listing->pickup_ends_at,
            'purpose' => $listing->purpose,
            'purpose_label' => MasterDataItem::labelFor('purpose', $listing->purpose),
            'district' => MasterDataItem::labelFor('district', $listing->district),
            'district_key' => $listing->district,
            'status' => $listing->status,
            'image_url' => $listing->photo_path ? route('listings.image', ['listingId' => $listing->id], false) : null,
            'verified' => $listing->owner?->umkm_verified_at !== null,
        ];
    }
}
