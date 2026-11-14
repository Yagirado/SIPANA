<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_sign_in_and_receive_their_role(): void
    {
        $user = User::factory()->create([
            'email' => 'warga@example.test',
            'password' => Hash::make('password-kuat'),
        ]);

        $response = $this->withHeader('Origin', 'http://localhost:5173')
            ->postJson('/api/login', [
                'email' => 'warga@example.test',
                'password' => 'password-kuat',
            ]);

        $response->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.role', 'community');

        $this->assertAuthenticatedAs($user);
    }

    public function test_current_user_endpoint_keeps_its_existing_response_shape(): void
    {
        $user = User::factory()->create()->fresh();

        $this->actingAs($user)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('role', 'community')
            ->assertJsonMissingPath('user');
    }

    public function test_unauthenticated_browser_request_to_api_returns_json_instead_of_redirecting_to_login(): void
    {
        $this->withHeader('Accept', 'text/html')
            ->get('/api/admin/verifications/4/document')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthenticated.');
    }

    public function test_invalid_credentials_do_not_create_a_session(): void
    {
        User::factory()->create([
            'email' => 'warga@example.test',
            'password' => Hash::make('password-kuat'),
        ]);

        $this->withHeader('Origin', 'http://localhost:5173')
            ->postJson('/api/login', [
                'email' => 'warga@example.test',
                'password' => 'salah',
            ])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Email atau kata sandi tidak cocok.');

        $this->assertGuest();
    }

    public function test_authenticated_user_can_sign_out(): void
    {
        User::factory()->create([
            'email' => 'warga@example.test',
            'password' => Hash::make('password-kuat'),
        ]);

        $this->withHeader('Origin', 'http://localhost:5173')
            ->postJson('/api/login', [
                'email' => 'warga@example.test',
                'password' => 'password-kuat',
            ])
            ->assertOk();

        $this->withHeader('Origin', 'http://localhost:5173')
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Anda telah keluar.');

        $this->app['auth']->forgetGuards();
        $this->getJson('/api/user')->assertUnauthorized();
    }
}
