<?php

namespace App\Repositories\Announcement\Contracts;

use App\Models\Announcement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AnnouncementRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function createWithRecipients(array $announcementData, Collection $guardians): Announcement;

    public function updateRecipientDelivery(Announcement $announcement, int $guardianId, array $data): bool;

    public function updateStatus(Announcement $announcement, array $data): bool;
}
