<?php

namespace App\Models;

use App\Enums\AnnouncementAudienceType;
use App\Enums\AnnouncementStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['created_by_id', 'title', 'message', 'sms_enabled', 'email_enabled', 'audience_type', 'status', 'sent_at'])]
class Announcement extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'sms_enabled' => 'boolean',
            'email_enabled' => 'boolean',
            'audience_type' => AnnouncementAudienceType::class,
            'status' => AnnouncementStatus::class,
            'sent_at' => 'immutable_datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(AnnouncementRecipient::class);
    }
}
