<?php

namespace App\Http\Requests\Attendance;

use App\Enums\AttendanceEventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_type' => ['required', 'string', Rule::enum(AttendanceEventType::class)],
            'scanned_at' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function attendanceData(): array
    {
        return $this->safe()->only(['event_type', 'scanned_at', 'note']);
    }
}
