<?php

namespace App\Repositories\Notification\Contracts;

use App\Models\NotificationSetting;
use Illuminate\Support\Collection;

interface NotificationSettingRepositoryInterface
{
    public function getAll(): Collection;

    public function findById(int $id): ?NotificationSetting;

    public function firstOrCreate(array $attributes, array $values): NotificationSetting;

    public function update(NotificationSetting $notificationSetting, array $data): bool;
}
