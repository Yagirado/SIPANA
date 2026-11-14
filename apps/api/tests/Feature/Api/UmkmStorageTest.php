<?php

namespace Tests\Feature\Api;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UmkmStorageTest extends TestCase
{
    use RefreshDatabase;

    public function test_b2_disk_endpoints_are_normalized_to_https_uris(): void
    {
        foreach (['b2-documents', 'b2-images'] as $disk) {
            $endpoint = config("filesystems.disks.{$disk}.endpoint");

            if ($endpoint) {
                $this->assertStringStartsWith('https://', $endpoint);
            }
        }
    }

    public function test_umkm_registration_stores_business_proof_on_b2_and_admin_can_read_it(): void
    {
        Storage::fake('b2-documents');

        $this->postJson('/api/register/umkm', [
            'owner' => 'Pemilik Usaha',
            'email' => 'umkm@example.test',
            'phone' => '081234567890',
            'business' => 'Warung Sejahtera',
            'businessType' => 'Warung makan',
            'district' => 'Karawang Barat',
            'address' => 'Jalan Mawar nomor 10',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'business_proof' => UploadedFile::fake()->image('proof.jpg'),
        ])->assertCreated();

        $user = User::query()->where('email', 'umkm@example.test')->firstOrFail();
        $path = $user->umkmProfile->business_proof_path;
        Storage::disk('b2-documents')->assertExists($path);

        $admin = User::factory()->create();
        $admin->forceFill(['role' => User::ROLE_ADMIN])->save();

        $this->actingAs($admin)
            ->get("/api/admin/verifications/{$user->id}/document")
            ->assertOk();

        $this->actingAs($admin)
            ->getJson("/api/admin/verifications/{$user->id}")
            ->assertOk()
            ->assertJsonPath('document_url', "/api/admin/verifications/{$user->id}/document");
    }

    public function test_listing_image_is_stored_on_b2_images_and_exposed_to_public_users(): void
    {
        Storage::fake('b2-images');

        $owner = User::factory()->create(['umkm_verified_at' => now()]);
        $owner->forceFill(['role' => User::ROLE_UMKM])->save();
        $owner->umkmProfile()->create([
            'business_name' => 'Warung Sejahtera',
            'business_type' => 'Warung makan',
            'business_address' => 'Jalan Mawar nomor 10',
            'business_proof_path' => 'umkm/business-proofs/proof.jpg',
        ]);
        $startsAt = now()->addHour();

        $response = $this->actingAs($owner)->post('/api/umkm/listings', [
            'title' => 'Nasi sayur',
            'description' => 'Porsi lebih hari ini',
            'quantity' => 6,
            'prepared_at' => now()->subMinutes(30)->toIso8601String(),
            'pickup_starts_at' => $startsAt->toIso8601String(),
            'pickup_ends_at' => $startsAt->copy()->addHours(2)->toIso8601String(),
            'purpose' => 'consumption',
            'district' => 'Karawang Barat',
            'safety_attested' => '1',
            'terms_accepted' => '1',
            'photo' => UploadedFile::fake()->image('surplus.jpg'),
        ])->assertCreated();

        $path = Listing::query()->findOrFail($response->json('listing.id'))->photo_path;
        $this->assertNotEmpty($path);
        Storage::disk('b2-images')->assertExists($path);

        $this->app['auth']->forgetGuards();
        $imageUrl = $this->getJson('/api/listings/'.$response->json('listing.id'))
            ->assertOk()
            ->json('image_url');
        $this->assertSame('/api/listings/'.$response->json('listing.id').'/image', $imageUrl);
        $this->assertSame('private', config('filesystems.disks.b2-images.visibility'));

        $this->get(parse_url($imageUrl, PHP_URL_PATH))->assertOk();
    }
}
