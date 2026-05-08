<?php

namespace App\Listeners;

use App\Events\AnnouncementCreated;
use App\Jobs\SendAnnouncementRecipientChunk;
use App\Jobs\UpdateAnnouncementDeliveryStatus;
use App\Repositories\Announcement\Contracts\AnnouncementRepositoryInterface;
use Illuminate\Support\Facades\Bus;

class QueueAnnouncementDeliveries
{
    public function __construct(
        protected AnnouncementRepositoryInterface $announcementRepository
    ) {}

    public function handle(AnnouncementCreated $event): void
    {
        $jobs = [];
        $announcementId = $event->announcement->id;

        $this->announcementRepository->chunkRecipientIds(
            announcementId: $announcementId,
            chunkSize: 100,
            callback: function (array $recipientIds) use (&$jobs, $announcementId): void {
                $jobs[] = new SendAnnouncementRecipientChunk(
                    announcementId: $announcementId,
                    recipientIds: $recipientIds
                );
            }
        );

        Bus::batch($jobs)
            ->then(function () use ($announcementId): void {
                UpdateAnnouncementDeliveryStatus::dispatch($announcementId);
            })
            ->name("announcement-delivery-{$announcementId}")
            ->dispatch();
    }
}
