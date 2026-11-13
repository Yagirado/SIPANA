<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_read_a_role_dashboard(): void
    {
        $this->getJson('/api/community/dashboard')->assertUnauthorized();
    }

    public function test_community_user_can_read_only_their_dashboard(): void
    {
        $user = $this->userWithRole('community');

        $this->actingAs($user)
            ->getJson('/api/community/dashboard')
            ->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.role', 'community');

        $this->actingAs($user)
            ->getJson('/api/admin/dashboard')
            ->assertForbidden();
    }

    public function test_umkm_user_can_read_only_their_dashboard(): void
    {
        $user = $this->userWithRole('umkm');

        $this->actingAs($user)
            ->getJson('/api/umkm/dashboard')
            ->assertOk()
            ->assertJsonPath('user.role', 'umkm');

        $this->actingAs($user)
            ->getJson('/api/community/dashboard')
            ->assertForbidden();
    }

    public function test_admin_user_can_read_only_their_dashboard(): void
    {
        $user = $this->userWithRole('admin');

        $this->actingAs($user)
            ->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('user.role', 'admin');

        $this->actingAs($user)
            ->getJson('/api/umkm/dashboard')
            ->assertForbidden();
    }

    private function userWithRole(string $role): User
    {
        $user = User::factory()->create();
        $user->forceFill(['role' => $role])->save();

        return $user->fresh();
    }
}
