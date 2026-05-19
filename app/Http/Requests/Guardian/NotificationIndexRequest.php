<?php

namespace App\Http\Requests\Guardian;

use App\Enums\AttendanceEventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NotificationIndexRequest extends FormRequest
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
        $validated = $this->validated();

        return [
            'student_id' => $validated['student_id'] ?? null,
            'event_type' => $validated['event_type'] ?? null,
            'date_from' => $validated['date_from'] ?? null,
            'date_to' => $validated['date_to'] ?? null,
            'search' => $validated['search'] ?? null,
        ];
    }
}
