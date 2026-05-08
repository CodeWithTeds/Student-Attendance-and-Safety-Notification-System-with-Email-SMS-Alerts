<?php

namespace App\Repositories\Notification\Eloquent;

use App\Enums\NotificationEventType;
use App\Models\NotificationSetting;
use App\Repositories\Notification\Contracts\NotificationSettingRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentNotificationSettingRepository implements NotificationSettingRepositoryInterface
{
    public function getAll(): Collection
    {
        $sortOrder = collect(NotificationEventType::cases())
            ->mapWithKeys(fn (NotificationEventType $eventType, int $index) => [$eventType->value => $index]);

        return NotificationSetting::query()
            ->get()
            ->sortBy(fn (NotificationSetting $setting) => $sortOrder[$setting->event_type->value] ?? 99)
            ->values();
    }

    public function findById(int $id): ?NotificationSetting
    {
        return NotificationSetting::find($id);
    }

    public function firstOrCreate(array $attributes, array $values): NotificationSetting
    {
        return NotificationSetting::firstOrCreate($attributes, $values);
    }

    public function update(NotificationSetting $notificationSetting, array $data): bool
    {
        return $notificationSetting->update($data);
    }
}
