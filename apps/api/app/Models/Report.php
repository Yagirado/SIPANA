<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Report extends Model
{
    public const CATEGORIES = ['food_safety', 'misrepresentation', 'inappropriate_behavior', 'other'];

    public const STATUSES = ['open', 'under_review', 'awaiting_response', 'resolved_no_action', 'resolved_action', 'appealed', 'appeal_resolved'];

    public const OPEN_STATUSES = ['open', 'under_review', 'awaiting_response', 'appealed'];

    protected $fillable = [
        'reporter_id', 'subject_user_id', 'listing_id', 'claim_id', 'category', 'description', 'status',
        'subject_summary', 'response_due_at', 'decision_action', 'decision_reason', 'reporter_outcome_summary',
        'decision_severe', 'decided_at', 'appeal_deadline_at', 'appealed_at', 'appeal_resolved_at',
        'appeal_outcome', 'appeal_reason', 'appeal_decision_reason', 'emergency_hold_at', 'emergency_hold_reason',
    ];

    protected function casts(): array
    {
        return [
            'response_due_at' => 'immutable_datetime',
            'decision_severe' => 'boolean',
            'decided_at' => 'immutable_datetime',
            'appeal_deadline_at' => 'immutable_datetime',
            'appealed_at' => 'immutable_datetime',
            'appeal_resolved_at' => 'immutable_datetime',
            'emergency_hold_at' => 'immutable_datetime',
        ];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subject_user_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(ReportEvent::class);
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claim::class);
    }
}
