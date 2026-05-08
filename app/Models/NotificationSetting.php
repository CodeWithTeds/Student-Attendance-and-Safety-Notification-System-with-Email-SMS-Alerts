<?php

namespace App\Models;

use App\Enums\NotificationEventType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['event_type', 'sms_enabled', 'email_enabled', 'title', 'message_template'])]
class NotificationSetting extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'event_type' => NotificationEventType::class,
            'sms_enabled' => 'boolean',
            'email_enabled' => 'boolean',
        ];
    }
}
