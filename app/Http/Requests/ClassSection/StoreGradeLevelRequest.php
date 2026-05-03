<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\GradeLevelYear;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', new Enum(GradeLevelYear::class), 'unique:grade_levels,name'],
            'code' => ['required', 'string', 'max:50', 'unique:grade_levels,code'],
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
