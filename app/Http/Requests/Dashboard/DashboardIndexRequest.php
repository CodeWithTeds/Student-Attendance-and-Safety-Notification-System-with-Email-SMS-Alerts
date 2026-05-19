<?php

namespace App\Http\Requests\Dashboard;

use App\Enums\DashboardAttendancePeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DashboardIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'attendance_period' => ['nullable', 'string', Rule::in(array_column(DashboardAttendancePeriod::cases(), 'value'))],
        ];
    }

    public function attendancePeriod(): DashboardAttendancePeriod
    {
        return DashboardAttendancePeriod::tryFrom((string) $this->validated('attendance_period')) ?? DashboardAttendancePeriod::WEEK;
    }
}
