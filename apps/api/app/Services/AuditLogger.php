<?php

namespace App\Services;

use App\Models\AdminAuditLog;
use App\Models\User;

class AuditLogger
{
    /** @param array<string, mixed>|null $before
     *  @param array<string, mixed>|null $after
     */
    public function record(
        User $actor,
        string $action,
        string $entityType,
        string|int|null $entityId,
        ?array $before = null,
        ?array $after = null,
        ?string $reason = null,
    ): AdminAuditLog {
        return AdminAuditLog::query()->create([
            'admin_id' => $actor->hasRole(User::ROLE_ADMIN) ? $actor->id : null,
            'actor_id' => $actor->id,
            'actor_role' => $actor->role,
            'actor_name' => $actor->name,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId === null ? null : (string) $entityId,
            'reason' => $reason,
            'before' => $before,
            'after' => $after,
            'created_at' => now(),
        ]);
    }

    /** @param array<string, mixed>|null $before
     *  @param array<string, mixed>|null $after
     */
    public function recordSystem(
        string $action,
        string $entityType,
        string|int|null $entityId,
        ?array $before = null,
        ?array $after = null,
        ?string $reason = null,
    ): AdminAuditLog {
        return AdminAuditLog::query()->create([
            'admin_id' => null,
            'actor_id' => null,
            'actor_role' => 'system',
            'actor_name' => 'Sistem',
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId === null ? null : (string) $entityId,
            'reason' => $reason,
            'before' => $before,
            'after' => $after,
            'created_at' => now(),
        ]);
    }
}
