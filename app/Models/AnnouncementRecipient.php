<?php

namespace App\Models;

use App\Enums\AnnouncementDeliveryStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['announcement_id', 'guardian_id', 'sms_status', 'email_status', 'sms_sent_at', 'email_sent_at', 'error_message'])]
class AnnouncementRecipient extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'sms_status' => AnnouncementDeliveryStatus::class,
            'email_status' => AnnouncementDeliveryStatus::class,
            'sms_sent_at' => 'immutable_datetime',
            'email_sent_at' => 'immutable_datetime',
        ];
    }

    public function announcement(): BelongsTo
    {
        return $this->belongsTo(Announcement::class);
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }
}
