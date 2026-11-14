<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminAuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'admin_id', 'actor_id', 'actor_role', 'actor_name', 'action', 'entity_type', 'entity_id', 'reason', 'before', 'after', 'created_at',
    ];

    protected function casts(): array
    {
        return ['before' => 'array', 'after' => 'array', 'created_at' => 'immutable_datetime'];
    }
}
