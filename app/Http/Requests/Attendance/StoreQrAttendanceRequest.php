<?php

namespace App\Http\Requests\Attendance;

use App\Enums\AttendanceEventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQrAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'qr_code_value' => ['required', 'string', 'max:500'],
            'event_type' => ['nullable', 'string', Rule::enum(AttendanceEventType::class)],
        ];
    }

    public function attendanceData(): array
    {
        return $this->safe()->only(['qr_code_value', 'event_type']);
    }
}
