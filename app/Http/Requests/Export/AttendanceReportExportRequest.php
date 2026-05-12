<?php

namespace App\Http\Requests\Export;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class AttendanceReportExportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'format' => ['required', 'in:csv,pdf'],
            'report_type' => ['required', 'in:daily,weekly,monthly,per_student,per_section'],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'student_id' => ['nullable', 'integer', 'exists:users,id'],
            'section_id' => ['nullable', 'integer', 'exists:sections,id'],
        ];
    }

    public function reportFilters(): array
    {
        return collect($this->validated())
            ->only(['report_type', 'date_from', 'date_to', 'student_id', 'section_id'])
            ->filter(fn ($value): bool => filled($value))
            ->all();
    }

    public function exportFormat(): string
    {
        return $this->validated('format');
    }
}
