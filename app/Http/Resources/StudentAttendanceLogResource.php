<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentAttendanceLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_type' => $this->event_type?->value ?? $this->event_type,
            'event_label' => $this->event_type?->label(),
            'status_label' => $this->event_type?->pastTenseLabel(),
            'scanned_at' => $this->scanned_at?->toIso8601String(),
            'scanned_at_display' => $this->scanned_at?->timezone(config('app.timezone'))->format('h:i A'),
            'student' => new UserResource($this->whenLoaded('student')),
        ];
    }
}
