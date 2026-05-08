<?php

namespace App\Enums;

enum AnnouncementStatus: string
{
    case SENT = 'sent';
    case PARTIAL = 'partial';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::SENT => 'Sent',
            self::PARTIAL => 'Partial',
            self::FAILED => 'Failed',
        };
    }
}
