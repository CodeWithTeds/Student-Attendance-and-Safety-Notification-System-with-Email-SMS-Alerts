<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_type' => $this->event_type?->value ?? $this->event_type,
            'event_label' => $this->event_type?->label(),
            'description' => $this->event_type?->description(),
            'sms_enabled' => (bool) $this->sms_enabled,
            'email_enabled' => (bool) $this->email_enabled,
            'title' => $this->title,
            'message_template' => $this->message_template,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
