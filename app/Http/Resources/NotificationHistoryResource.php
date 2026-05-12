<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'announcement' => [
                'id' => $this->announcement?->id,
                'title' => $this->announcement?->title,
                'message' => $this->announcement?->message,
                'creator' => $this->announcement?->relationLoaded('creator')
                    ? new UserResource($this->announcement->creator)
                    : null,
            ],
            'guardian' => new UserResource($this->whenLoaded('guardian')),
            'sms_status' => $this->sms_status?->value ?? $this->sms_status,
            'email_status' => $this->email_status?->value ?? $this->email_status,
            'sms_sent_at_display' => $this->sms_sent_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'email_sent_at_display' => $this->email_sent_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'error_message' => $this->error_message,
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_display' => $this->updated_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
        ];
    }
}
