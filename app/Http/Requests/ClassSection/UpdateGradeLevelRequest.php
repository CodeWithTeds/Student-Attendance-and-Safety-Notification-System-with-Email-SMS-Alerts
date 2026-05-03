<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\GradeLevelYear;
use App\Enums\UserRole;
use App\Models\GradeLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        $gradeLevel = $this->route('gradeLevel');
        $gradeLevelId = $gradeLevel instanceof GradeLevel ? $gradeLevel->id : $gradeLevel;

        return [
            'name' => ['required', new Enum(GradeLevelYear::class), Rule::unique('grade_levels', 'name')->ignore($gradeLevelId)],
            'code' => ['required', 'string', 'max:50', Rule::unique('grade_levels', 'code')->ignore($gradeLevelId)],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('name')) {
            return;
        }

        $gradeLevel = GradeLevelYear::fromName($this->input('name'));

        $this->merge([
            'code' => $gradeLevel->code(),
            'sort_order' => $gradeLevel->sortOrder(),
        ]);
    }
}
