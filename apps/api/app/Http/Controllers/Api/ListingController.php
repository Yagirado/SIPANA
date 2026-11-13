<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{
    private const DISTRICTS = ['Karawang Barat', 'Telukjambe Timur', 'Karawang Timur'];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'district' => ['nullable', Rule::in(self::DISTRICTS)],
            'purpose' => ['nullable', Rule::in(Listing::PURPOSES)],
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
            ->whereIn('status', [Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED, Listing::STATUS_EXPIRED])
            ->findOrFail($listingId);

        return response()->json($this->publicData($listing));
    }

    public function expireDueRecords(): void
    {
        $now = now();

        Listing::query()
            ->whereIn('status', [Listing::STATUS_PUBLISHED, Listing::STATUS_CLAIMED])
            ->where('pickup_ends_at', '<=', $now)
            ->update(['status' => Listing::STATUS_EXPIRED, 'updated_at' => $now]);

        \App\Models\Claim::query()
            ->where('status', \App\Models\Claim::STATUS_ACTIVE)
            ->whereHas('listing', fn ($query) => $query->where('pickup_ends_at', '<=', $now))
            ->update(['status' => \App\Models\Claim::STATUS_EXPIRED, 'updated_at' => $now]);
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
            'district' => $listing->district,
            'pickup_address' => $listing->pickup_address,
            'status' => $listing->status,
            'verified' => $listing->owner?->umkm_verified_at !== null,
        ];
    }
}
