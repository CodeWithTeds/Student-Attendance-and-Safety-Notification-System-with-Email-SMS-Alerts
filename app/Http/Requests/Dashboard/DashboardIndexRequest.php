<?php

namespace App\Http\Requests\Dashboard;

use App\Enums\DashboardAttendancePeriod;
use Carbon\CarbonImmutable;
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
            'attendance_date' => ['nullable', 'date'],
        ];
    }

    public function attendancePeriod(): DashboardAttendancePeriod
    {
        return DashboardAttendancePeriod::tryFrom((string) $this->validated('attendance_period')) ?? DashboardAttendancePeriod::WEEK;
    }

    public function attendanceDate(): CarbonImmutable
    {
        $date = $this->validated('attendance_date');

        return $date ? CarbonImmutable::parse($date) : CarbonImmutable::today();
    }
}
