<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UmkmProfile extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'business_name',
        'business_type',
        'business_address',
        'business_proof_path',
        'verification_status',
        'verification_reason',
        'terms_accepted_at',
        'terms_version',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return ['terms_accepted_at' => 'immutable_datetime'];
    }
}
