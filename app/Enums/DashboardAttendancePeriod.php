<?php

namespace App\Enums;

enum DashboardAttendancePeriod: string
{
    case DAY = 'day';
    case WEEK = 'week';
    case MONTH = 'month';

    public function label(): string
    {
        return match ($this) {
            self::DAY => 'Day',
            self::WEEK => 'Week',
            self::MONTH => 'Month',
        };
    }
}
