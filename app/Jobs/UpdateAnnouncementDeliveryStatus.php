<?php

namespace App\Jobs;

use App\Services\Announcement\AnnouncementService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UpdateAnnouncementDeliveryStatus implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $announcementId) {}

    public function handle(AnnouncementService $announcementService): void
    {
        $announcementService->refreshDeliveryStatus($this->announcementId);
    }
}
