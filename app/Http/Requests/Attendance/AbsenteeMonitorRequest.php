<?php

namespace App\Http\Requests\Attendance;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class AbsenteeMonitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'student_id' => ['nullable', 'integer', 'exists:users,id'],
            'section_id' => ['nullable', 'integer', 'exists:sections,id'],
            'absence_threshold' => ['nullable', 'integer', 'min:1', 'max:60'],
            'late_threshold' => ['nullable', 'integer', 'min:1', 'max:60'],
        ];
    }

    public function filters(): array
    {
        return collect($this->validated())
            ->filter(fn ($value): bool => filled($value))
            ->all();
    }
}
