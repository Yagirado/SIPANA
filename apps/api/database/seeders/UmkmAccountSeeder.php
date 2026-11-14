<?php

namespace Database\Seeders;

use App\Models\MasterDataItem;
use App\Models\UmkmProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class UmkmAccountSeeder extends Seeder
{
    private const ACCOUNT_COUNT = 20;

    private const DISTRICTS = [
        'karawang_barat',
        'telukjambe_timur',
        'karawang_timur',
    ];

    private const BUSINESS_TYPES = [
        'Makanan berat',
        'Kue dan roti',
        'Camilan',
        'Minuman',
    ];

    public function run(): void
    {
        $districts = MasterDataItem::activeKeys('district', true) ?: self::DISTRICTS;
        $now = now();

        for ($number = 1; $number <= self::ACCOUNT_COUNT; $number++) {
            $suffix = str_pad((string) $number, 2, '0', STR_PAD_LEFT);
            $district = $districts[($number - 1) % count($districts)];
            $businessName = "Dapur Sipana {$suffix}";
            $user = User::firstOrNew(['email' => "seed.umkm.{$suffix}@sipana.test"]);

            $user->name = "Pemilik {$businessName}";
            $user->password ??= 'password';
            $user->forceFill([
                'role' => User::ROLE_UMKM,
                'phone' => '08120000'.str_pad((string) $number, 4, '0', STR_PAD_LEFT),
                'district' => $district,
                'email_verified_at' => $user->email_verified_at ?? $now,
                'umkm_verified_at' => $user->umkm_verified_at ?? $now,
                'privacy_consent_at' => $user->privacy_consent_at ?? $now,
                'moderation_status' => 'active',
            ]);
            $user->save();

            UmkmProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'business_name' => $businessName,
                    'business_type' => self::BUSINESS_TYPES[($number - 1) % count(self::BUSINESS_TYPES)],
                    'business_address' => "Jl. Contoh No. {$number}, {$district}",
                    // Required column; seeded accounts are already verified, so this is only a placeholder.
                    'business_proof_path' => "seed-data/business-proofs/{$suffix}.png",
                    'verification_status' => 'verified',
                    'verification_reason' => null,
                    'terms_accepted_at' => $now,
                    'terms_version' => '1.0',
                ],
            );
        }
    }
}
