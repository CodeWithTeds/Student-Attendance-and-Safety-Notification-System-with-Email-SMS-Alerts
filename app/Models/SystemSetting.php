<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['school_name', 'school_id', 'school_email', 'school_phone', 'school_address', 'sms_provider', 'sms_api_key', 'sms_sender_id', 'mail_mailer', 'mail_host', 'mail_port', 'mail_username', 'mail_password', 'mail_encryption', 'mail_from_address', 'mail_from_name', 'role_permissions'])]
class SystemSetting extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'sms_api_key' => 'encrypted',
            'mail_password' => 'encrypted',
            'mail_port' => 'integer',
            'role_permissions' => 'array',
        ];
    }
}
