<?php

namespace App\Http\Requests\Notification;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'sms_enabled' => ['required', 'boolean'],
            'email_enabled' => ['required', 'boolean'],
            'title' => ['required', 'string', 'max:120'],
            'message_template' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function settingData(): array
    {
        return [
            ...$this->validated(),
            'sms_enabled' => $this->boolean('sms_enabled'),
            'email_enabled' => $this->boolean('email_enabled'),
        ];
    }
}
