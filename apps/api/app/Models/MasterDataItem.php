<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterDataItem extends Model
{
    protected $fillable = ['type', 'key', 'label', 'sort_order', 'is_active', 'available_for_listings'];

    /** @return array<int, string> */
    public static function activeKeys(string $type, bool $listingOnly = false): array
    {
        return static::query()->where('type', $type)->where('is_active', true)
            ->when($listingOnly, fn ($query) => $query->where('available_for_listings', true))
            ->orderBy('sort_order')->pluck('key')->all();
    }

    public static function labelFor(string $type, ?string $key): ?string
    {
        if ($key === null) return null;

        return static::query()->where('type', $type)->where('key', $key)->value('label') ?? $key;
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'available_for_listings' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
