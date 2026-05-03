<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class StoreGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:grade_levels,name'],
            'code' => ['required', 'string', 'max:50', 'unique:grade_levels,code'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ];
    }
}
