<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class StoreAdviserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'lowercase', 'email', 'max:255', 'unique:advisers,email'],
            'phone' => ['nullable', 'string', 'max:50'],
        ];
    }
}
