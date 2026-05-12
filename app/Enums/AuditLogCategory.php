<?php

namespace App\Enums;

enum AuditLogCategory: string
{
    case ADMIN_ACTION = 'admin_action';
    case ATTENDANCE_CHANGE = 'attendance_change';
    case NOTIFICATION = 'notification';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN_ACTION => 'Admin action',
            self::ATTENDANCE_CHANGE => 'Attendance change',
            self::NOTIFICATION => 'Notification',
        };
    }
}
