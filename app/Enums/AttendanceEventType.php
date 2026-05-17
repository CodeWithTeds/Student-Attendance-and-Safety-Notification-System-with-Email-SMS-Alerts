<?php

namespace App\Enums;

enum AttendanceEventType: string
{
    case CHECK_IN = 'check_in';
    case CHECK_OUT = 'check_out';

    public function label(): string
    {
        return match ($this) {
            self::CHECK_IN => 'Time In',
            self::CHECK_OUT => 'Time Out',
        };
    }

    public function pastTenseLabel(): string
    {
        return match ($this) {
            self::CHECK_IN => 'Timed In',
            self::CHECK_OUT => 'Timed Out',
        };
    }
}
