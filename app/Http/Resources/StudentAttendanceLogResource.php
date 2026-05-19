<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentAttendanceLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $scheduleStatus = 'On Time';

        $section = null;
        $schedule = null;

        if ($this->relationLoaded('student') && $this->student?->relationLoaded('sections')) {
            $section = $this->student->sections->first();
            $schedule = $section && $section->relationLoaded('schedule') ? $section->schedule : null;
        }

        if ($this->event_type?->value === 'check_in' && $this->scanned_at) {
            if ($schedule) {
                $timeIn = $schedule->time_in;
                $scanTime = $this->scanned_at->timezone(config('app.timezone'))->format('H:i:s');
                if ($scanTime > $timeIn) {
                    $scheduleStatus = 'Late';
                }
            }
        } elseif ($this->event_type?->value === 'check_out') {
            $scheduleStatus = 'Completed';
        }

        return [
            'id' => $this->id,
            'event_type' => $this->event_type?->value ?? $this->event_type,
            'event_label' => $this->event_type?->label(),
            'status_label' => $this->event_type?->pastTenseLabel(),
            'schedule_status' => $scheduleStatus,
            'scanned_at' => $this->scanned_at?->toIso8601String(),
            'scanned_at_display' => $this->scanned_at?->timezone(config('app.timezone'))->format('h:i A'),
            'scanned_at_full_display' => $this->scanned_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
            'schedule' => $schedule ? new SectionScheduleResource($schedule) : null,
            'student' => new UserResource($this->whenLoaded('student')),
            'edit_history' => StudentAttendanceLogEditResource::collection($this->whenLoaded('editHistory')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
