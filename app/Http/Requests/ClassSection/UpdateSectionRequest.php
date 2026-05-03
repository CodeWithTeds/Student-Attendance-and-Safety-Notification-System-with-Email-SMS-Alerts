<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\UserRole;
use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        $section = $this->route('section');
        $sectionId = $section instanceof Section ? $section->id : $section;

        return [
            'grade_level_id' => ['required', 'exists:grade_levels,id'],
            'adviser_id' => ['nullable', 'exists:advisers,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sections', 'name')
                    ->where('grade_level_id', $this->input('grade_level_id'))
                    ->where('school_year', $this->input('school_year'))
                    ->ignore($sectionId),
            ],
            'school_year' => ['required', 'string', 'max:20'],
            'capacity' => ['nullable', 'integer', 'min:1', 'max:500'],
        ];
    }
}
