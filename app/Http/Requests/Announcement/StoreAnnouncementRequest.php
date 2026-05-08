<?php

namespace App\Http\Requests\Announcement;

use App\Enums\AnnouncementAudienceType;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:2000'],
            'sms_enabled' => ['required', 'boolean'],
            'email_enabled' => ['required', 'boolean'],
            'audience_type' => ['required', Rule::enum(AnnouncementAudienceType::class)],
            'guardian_ids' => ['required_if:audience_type,'.AnnouncementAudienceType::SELECTED_GUARDIANS->value, 'array'],
            'guardian_ids.*' => ['integer', 'exists:users,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if (! $this->boolean('sms_enabled') && ! $this->boolean('email_enabled')) {
                $validator->errors()->add('channels', 'Choose at least one delivery channel.');
            }
        });
    }

    public function announcementData(): array
    {
        return [
            ...$this->validated(),
            'sms_enabled' => $this->boolean('sms_enabled'),
            'email_enabled' => $this->boolean('email_enabled'),
            'guardian_ids' => $this->input('guardian_ids', []),
        ];
    }
}
