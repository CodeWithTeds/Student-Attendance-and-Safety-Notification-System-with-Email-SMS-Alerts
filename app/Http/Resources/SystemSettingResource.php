<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SystemSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_name' => $this->school_name,
            'school_id' => $this->school_id,
            'school_email' => $this->school_email,
            'school_phone' => $this->school_phone,
            'school_address' => $this->school_address,
            'sms_provider' => $this->sms_provider,
            'sms_api_key_configured' => filled($this->sms_api_key),
            'sms_sender_id' => $this->sms_sender_id,
            'mail_mailer' => $this->mail_mailer,
            'mail_host' => $this->mail_host,
            'mail_port' => $this->mail_port,
            'mail_username' => $this->mail_username,
            'mail_password_configured' => filled($this->mail_password),
            'mail_encryption' => $this->mail_encryption,
            'mail_from_address' => $this->mail_from_address,
            'mail_from_name' => $this->mail_from_name,
            'role_permissions' => $this->role_permissions ?? [],
            'updated_at' => $this->updated_at?->toIso8601String(),
            'updated_at_display' => $this->updated_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
        ];
    }
}
