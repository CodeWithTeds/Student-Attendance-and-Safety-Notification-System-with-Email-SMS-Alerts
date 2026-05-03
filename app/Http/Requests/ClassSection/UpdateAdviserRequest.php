<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\UserRole;
use App\Models\Adviser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdviserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        $adviser = $this->route('adviser');
        $adviserId = $adviser instanceof Adviser ? $adviser->id : $adviser;

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'lowercase', 'email', 'max:255', Rule::unique('advisers', 'email')->ignore($adviserId)],
            'phone' => ['nullable', 'string', 'max:50'],
        ];
    }
}
