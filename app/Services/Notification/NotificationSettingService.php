<?php

namespace App\Services\Notification;

use App\Enums\AuditLogCategory;
use App\Enums\NotificationEventType;
use App\Models\NotificationSetting;
use App\Repositories\Notification\Contracts\NotificationSettingRepositoryInterface;
use App\Services\Audit\AuditTrailService;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class NotificationSettingService
{
    public function __construct(
        protected NotificationSettingRepositoryInterface $notificationSettingRepository,
        protected AuditTrailService $auditTrailService
    ) {}

    public function getSettings(): Collection
    {
        foreach (NotificationEventType::cases() as $eventType) {
            $this->notificationSettingRepository->firstOrCreate(
                ['event_type' => $eventType->value],
                [
                    'sms_enabled' => false,
                    'email_enabled' => true,
                    'title' => $eventType->defaultTitle(),
                    'message_template' => $eventType->defaultMessageTemplate(),
                ]
            );
        }

        return $this->notificationSettingRepository->getAll();
    }

    public function updateSetting(int $id, array $data): NotificationSetting
    {
        $notificationSetting = $this->resolveSetting($id);
        $previous = $notificationSetting->only(['sms_enabled', 'email_enabled', 'title', 'message_template']);

        $this->notificationSettingRepository->update($notificationSetting, $data);

        $notificationSetting->refresh();

        $this->auditTrailService->record(
            AuditLogCategory::NOTIFICATION,
            'notification.setting_updated',
            "Updated {$notificationSetting->event_type->label()} notification settings.",
            $notificationSetting,
            [
                'previous' => $previous,
                'current' => $notificationSetting->only(['sms_enabled', 'email_enabled', 'title', 'message_template']),
            ]
        );

        return $notificationSetting;
    }

    protected function resolveSetting(int $id): NotificationSetting
    {
        $notificationSetting = $this->notificationSettingRepository->findById($id);

        if (! $notificationSetting) {
            throw ValidationException::withMessages([
                'notification' => 'Notification setting could not be found.',
            ]);
        }

        return $notificationSetting;
    }
}
