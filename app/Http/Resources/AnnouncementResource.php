<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'message' => $this->message,
            'sms_enabled' => (bool) $this->sms_enabled,
            'email_enabled' => (bool) $this->email_enabled,
            'audience_type' => $this->audience_type?->value ?? $this->audience_type,
            'audience_label' => $this->audience_type?->label(),
            'status' => $this->status?->value ?? $this->status,
            'status_label' => $this->status?->label(),
            'sent_at' => $this->sent_at?->toIso8601String(),
            'sent_at_display' => $this->sent_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'recipients_count' => $this->recipients_count ?? 0,
            'sms_sent_count' => $this->sms_sent_count ?? 0,
            'email_sent_count' => $this->email_sent_count ?? 0,
            'creator' => new UserResource($this->whenLoaded('creator')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
