<?php

namespace App\Http\Requests\Guardian;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($this->route('guardian'))],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:30'],
            'notification_sms_enabled' => ['boolean'],
            'notification_email_enabled' => ['boolean'],
            'student_ids' => ['nullable', 'array'],
            'student_ids.*' => [Rule::exists('users', 'id')->where('role', UserRole::STUDENT->value)],
        ];
    }

    public function guardianData(): array
    {
        return $this->validated() + [
            'role' => UserRole::PARENT->value,
            'notification_sms_enabled' => $this->boolean('notification_sms_enabled'),
            'notification_email_enabled' => $this->boolean('notification_email_enabled'),
        ];
    }
}
