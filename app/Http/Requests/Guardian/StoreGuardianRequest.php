<?php

namespace App\Http\Requests\Guardian;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'digits:11'],
            'notification_sms_enabled' => ['boolean'],
            'notification_email_enabled' => ['boolean'],
            'student_ids' => ['nullable', 'array'],
            'student_ids.*' => [
                Rule::exists('users', 'id')->where('role', UserRole::STUDENT->value),
                function ($attribute, $value, $fail) {
                    $count = \Illuminate\Support\Facades\DB::table('parent_student')->where('student_id', $value)->count();
                    if ($count >= 2) {
                        $fail("The student with ID {$value} has already been assigned to 2 parents.");
                    }
                }
            ],
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
