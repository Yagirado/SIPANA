<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportEvent extends Model
{
    protected $fillable = ['report_id', 'actor_id', 'event_type', 'visibility', 'body', 'metadata'];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
