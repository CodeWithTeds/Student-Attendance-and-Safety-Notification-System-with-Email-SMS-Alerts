<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentAttendanceLogEditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'old_event_type' => $this->old_event_type?->value ?? $this->old_event_type,
            'old_event_label' => $this->old_event_type?->label(),
            'new_event_type' => $this->new_event_type?->value ?? $this->new_event_type,
            'new_event_label' => $this->new_event_type?->label(),
            'old_scanned_at' => $this->old_scanned_at?->toIso8601String(),
            'old_scanned_at_display' => $this->old_scanned_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'new_scanned_at' => $this->new_scanned_at?->toIso8601String(),
            'new_scanned_at_display' => $this->new_scanned_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'note' => $this->note,
            'editor' => new UserResource($this->whenLoaded('editor')),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_display' => $this->created_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
        ];
    }
}
