<?php

namespace App\Enums;

enum AnnouncementDeliveryStatus: string
{
    case SENT = 'sent';
    case SKIPPED = 'skipped';
    case FAILED = 'failed';
}
