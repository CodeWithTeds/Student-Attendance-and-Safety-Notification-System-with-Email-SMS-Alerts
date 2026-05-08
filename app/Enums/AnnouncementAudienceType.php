<?php

namespace App\Enums;

enum AnnouncementAudienceType: string
{
    case ALL_GUARDIANS = 'all_guardians';
    case SELECTED_GUARDIANS = 'selected_guardians';

    public function label(): string
    {
        return match ($this) {
            self::ALL_GUARDIANS => 'All guardians',
            self::SELECTED_GUARDIANS => 'Selected guardians',
        };
    }
}
