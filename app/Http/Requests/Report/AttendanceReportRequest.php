<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_type' => ['nullable', 'in:daily,weekly,monthly,per_student,per_section'],
            'date_from'   => ['required', 'date'],
            'date_to'     => ['required', 'date', 'after_or_equal:date_from'],
            'student_id'  => ['nullable', 'integer', 'exists:users,id'],
            'section_id'  => ['nullable', 'integer', 'exists:sections,id'],
        ];
    }

    public function reportFilters(): array
    {
        $filters = $this->only(['date_from', 'date_to', 'student_id', 'section_id']);
        $filters['report_type'] = $this->input('report_type', 'daily');

        return $filters;
    }
}
