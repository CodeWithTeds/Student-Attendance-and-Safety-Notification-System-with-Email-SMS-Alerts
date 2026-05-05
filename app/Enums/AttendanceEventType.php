<?php

namespace App\Enums;

enum AttendanceEventType: string
{
    case CHECK_IN = 'check_in';
    case CHECK_OUT = 'check_out';

    public function label(): string
    {
        return match ($this) {
            self::CHECK_IN => 'Check-in',
            self::CHECK_OUT => 'Check-out',
        };
    }

    public function pastTenseLabel(): string
    {
        return match ($this) {
            self::CHECK_IN => 'Checked in',
            self::CHECK_OUT => 'Checked out',
        };
    }
}
