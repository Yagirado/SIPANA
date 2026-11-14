<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\MasterDataItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class FoodListingSeeder extends Seeder
{
    private const ACCOUNT_COUNT = 20;

    private const LISTINGS_PER_ACCOUNT = 5;

    private const FOODS = [
        'Nasi ayam',
        'Nasi uduk',
        'Nasi kuning',
        'Nasi goreng',
        'Nasi liwet',
        'Mie goreng',
        'Bihun goreng',
        'Soto ayam',
        'Sayur asem',
        'Ayam bakar',
        'Ayam goreng',
        'Paket lauk rumahan',
        'Roti isi',
        'Roti manis',
        'Kue bolu',
        'Pisang goreng',
        'Risoles',
        'Pastel',
        'Puding buah',
        'Jus buah',
    ];

    private const DISTRICTS = [
        'karawang_barat',
        'telukjambe_timur',
        'karawang_timur',
    ];

    public function run(): void
    {
        $emails = collect(range(1, self::ACCOUNT_COUNT))
            ->map(fn (int $number): string => sprintf('seed.umkm.%02d@sipana.test', $number));
        $owners = User::query()->whereIn('email', $emails)->orderBy('email')->get();

        if ($owners->count() !== self::ACCOUNT_COUNT) {
            throw new RuntimeException('Jalankan UmkmAccountSeeder sebelum FoodListingSeeder.');
        }

        $districts = MasterDataItem::activeKeys('district', true) ?: self::DISTRICTS;
        $purposes = MasterDataItem::activeKeys('purpose') ?: Listing::PURPOSES;
        $now = now();

        foreach ($owners->values() as $ownerIndex => $owner) {
            $accountNumber = $ownerIndex + 1;
            $suffix = str_pad((string) $accountNumber, 2, '0', STR_PAD_LEFT);
            $businessName = "Dapur Sipana {$suffix}";
            $district = $districts[$ownerIndex % count($districts)];

            for ($listingNumber = 1; $listingNumber <= self::LISTINGS_PER_ACCOUNT; $listingNumber++) {
                $foodIndex = (($accountNumber - 1) * self::LISTINGS_PER_ACCOUNT + $listingNumber - 1) % count(self::FOODS);
                $title = self::FOODS[$foodIndex];
                $preparedAt = $now->copy()->subHours(2)->subMinutes($listingNumber * 7);

                Listing::updateOrCreate(
                    ['owner_id' => $owner->id, 'title' => $title],
                    [
                        'business_name' => $businessName,
                        'description' => "{$title} layak konsumsi, dibuat hari ini dan siap dibagikan.",
                        'quantity' => 5 + (($accountNumber + $listingNumber) % 16),
                        'prepared_at' => $preparedAt,
                        'pickup_starts_at' => $now->copy()->subMinutes(30),
                        'pickup_ends_at' => $now->copy()->addHours(4),
                        'purpose' => $purposes[($accountNumber + $listingNumber - 2) % count($purposes)],
                        'district' => $district,
                        'pickup_address' => "Jl. Contoh No. {$accountNumber}, {$district}",
                        'photo_path' => null,
                        'safety_attested_at' => $now,
                        'status' => Listing::STATUS_PUBLISHED,
                        'moderation_status' => Listing::MODERATION_ACTIVE,
                        'moderation_reason' => null,
                        'moderation_case_id' => null,
                        'moderation_changed_at' => null,
                    ],
                );
            }
        }
    }
}
