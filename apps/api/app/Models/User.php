<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'phone', 'gender', 'birth_date', 'district', 'privacy_consent_at', 'moderation_status', 'moderation_reason', 'moderation_case_id', 'restricted_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    public const ROLE_COMMUNITY = 'community';

    public const ROLE_UMKM = 'umkm';

    public const ROLE_ADMIN = 'admin';

    public const ROLES = [
        self::ROLE_COMMUNITY,
        self::ROLE_UMKM,
        self::ROLE_ADMIN,
    ];

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birth_date' => 'date:Y-m-d',
            'privacy_consent_at' => 'datetime',
            'umkm_verified_at' => 'datetime',
            'restricted_at' => 'immutable_datetime',
            'password' => 'hashed',
        ];
    }

    public function isModerationRestricted(): bool
    {
        return $this->moderation_status === 'restricted';
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class, 'owner_id');
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class, 'claimant_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function umkmProfile(): HasOne
    {
        return $this->hasOne(UmkmProfile::class);
    }
}
