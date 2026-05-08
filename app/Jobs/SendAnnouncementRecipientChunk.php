<?php

namespace App\Jobs;

use App\Services\Announcement\AnnouncementService;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendAnnouncementRecipientChunk implements ShouldQueue
{
    use Batchable, Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public int $announcementId,
        public array $recipientIds
    ) {}

    public function handle(AnnouncementService $announcementService): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        $announcementService->deliverRecipientChunk(
            announcementId: $this->announcementId,
            recipientIds: $this->recipientIds
        );
    }
}
