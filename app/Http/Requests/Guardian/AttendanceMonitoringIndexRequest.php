<?php

namespace App\Http\Requests\Guardian;

use App\Enums\AttendanceEventType;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttendanceMonitoringIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period' => ['nullable', Rule::in(['daily', 'monthly'])],
            'date' => ['nullable', 'date'],
            'month' => ['nullable', 'date_format:Y-m'],
            'student_id' => ['nullable', 'integer'],
            'event_type' => ['nullable', Rule::enum(AttendanceEventType::class)],
            'search' => ['nullable', 'string', 'max:120'],
        ];
    }

    public function filters(): array
    {
        $timezone = (string) config('app.timezone', 'UTC');
        $validated = $this->validated();
        $period = $validated['period'] ?? 'daily';

        if ($period === 'monthly') {
            $month = CarbonImmutable::parse(($validated['month'] ?? now($timezone)->format('Y-m')).'-01', $timezone);

            return [
                'period' => 'monthly',
                'date' => null,
                'month' => $month->format('Y-m'),
                'date_from' => $month->startOfMonth()->toDateString(),
                'date_to' => $month->endOfMonth()->toDateString(),
                'student_id' => $validated['student_id'] ?? null,
                'event_type' => $validated['event_type'] ?? null,
                'search' => $validated['search'] ?? null,
            ];
        }

        $date = CarbonImmutable::parse($validated['date'] ?? now($timezone)->toDateString(), $timezone);

        return [
            'period' => 'daily',
            'date' => $date->toDateString(),
            'month' => null,
            'date_from' => $date->toDateString(),
            'date_to' => $date->toDateString(),
            'student_id' => $validated['student_id'] ?? null,
            'event_type' => $validated['event_type'] ?? null,
            'search' => $validated['search'] ?? null,
        ];
    }
}
