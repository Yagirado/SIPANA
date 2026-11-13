<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Listing extends Model
{
    public const STATUS_PUBLISHED = 'published';

    public const STATUS_CLAIMED = 'claimed';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_EXPIRED = 'expired';

    public const STATUS_WITHDRAWN = 'withdrawn';

    public const STATUS_REMOVED = 'removed';

    public const PURPOSES = ['consumption', 'redistribution', 'animal_feed'];

    protected $fillable = [
        'owner_id', 'business_name', 'title', 'description', 'quantity', 'prepared_at',
        'pickup_starts_at', 'pickup_ends_at', 'purpose', 'district', 'pickup_address',
        'photo_path', 'safety_attested_at', 'status',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'prepared_at' => 'immutable_datetime',
            'pickup_starts_at' => 'immutable_datetime',
            'pickup_ends_at' => 'immutable_datetime',
            'safety_attested_at' => 'immutable_datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function claim(): HasOne
    {
        return $this->hasOne(Claim::class);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED)
            ->where('pickup_ends_at', '>', now())
            ->whereHas('owner', fn (Builder $owner) => $owner->whereNotNull('umkm_verified_at'));
    }
}
