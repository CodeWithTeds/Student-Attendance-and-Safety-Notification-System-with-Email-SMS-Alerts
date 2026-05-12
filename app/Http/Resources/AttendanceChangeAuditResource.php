<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceChangeAuditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'attendance_log_id' => $this->student_attendance_log_id,
            'student' => new UserResource($this->whenLoaded('attendanceLog')->student),
            'editor' => new UserResource($this->whenLoaded('editor')),
            'old_event_type' => $this->old_event_type?->value ?? $this->old_event_type,
            'old_event_label' => $this->old_event_type?->label(),
            'new_event_type' => $this->new_event_type?->value ?? $this->new_event_type,
            'new_event_label' => $this->new_event_type?->label(),
            'old_scanned_at_display' => $this->old_scanned_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'new_scanned_at_display' => $this->new_scanned_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'note' => $this->note,
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_display' => $this->created_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
        ];
    }
}
