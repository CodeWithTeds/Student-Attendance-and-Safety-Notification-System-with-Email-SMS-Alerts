<?php

namespace App\Http\Requests\System;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'school_name' => ['required', 'string', 'max:160'],
            'school_id' => ['nullable', 'string', 'max:80'],
            'school_email' => ['nullable', 'email', 'max:160'],
            'school_phone' => ['nullable', 'string', 'max:40'],
            'school_address' => ['nullable', 'string', 'max:500'],
            'sms_provider' => ['nullable', 'string', 'max:80'],
            'sms_api_key' => ['nullable', 'string', 'max:1000'],
            'sms_sender_id' => ['nullable', 'string', 'max:40'],
            'mail_mailer' => ['nullable', 'string', 'max:40'],
            'mail_host' => ['nullable', 'string', 'max:160'],
            'mail_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'mail_username' => ['nullable', 'string', 'max:160'],
            'mail_password' => ['nullable', 'string', 'max:1000'],
            'mail_encryption' => ['nullable', 'string', 'max:20'],
            'mail_from_address' => ['nullable', 'email', 'max:160'],
            'mail_from_name' => ['nullable', 'string', 'max:160'],
            'role_permissions' => ['required', 'array'],
            'role_permissions.*' => ['array'],
            'role_permissions.*.*' => ['string', 'max:120'],
        ];
    }

    public function settingData(): array
    {
        return $this->validated();
    }
}
