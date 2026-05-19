<?php

namespace App\Http\Requests\Guardian;

use App\Enums\AttendanceEventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DashboardIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['nullable', 'integer'],
            'event_type' => ['nullable', Rule::enum(AttendanceEventType::class)],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'search' => ['nullable', 'string', 'max:120'],
        ];
    }

    public function filters(): array
    {
        $timezone = (string) config('app.timezone', 'UTC');
        $validated = $this->validated();

        return [
            'student_id' => $validated['student_id'] ?? null,
            'event_type' => $validated['event_type'] ?? null,
            'date_from' => $validated['date_from'] ?? now($timezone)->subDays(6)->toDateString(),
            'date_to' => $validated['date_to'] ?? now($timezone)->toDateString(),
            'search' => $validated['search'] ?? null,
        ];
    }
}
