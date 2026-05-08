<?php

namespace App\Services\Announcement;

use App\Enums\AnnouncementAudienceType;
use App\Enums\AnnouncementDeliveryStatus;
use App\Enums\AnnouncementStatus;
use App\Events\AnnouncementCreated;
use App\Mail\SchoolAnnouncementMail;
use App\Models\Announcement;
use App\Models\User;
use App\Repositories\Announcement\Contracts\AnnouncementRepositoryInterface;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Services\Notification\SmsNotificationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class AnnouncementService
{
    public function __construct(
        protected AnnouncementRepositoryInterface $announcementRepository,
        protected UserRepositoryInterface $userRepository,
        protected SmsNotificationService $smsNotificationService
    ) {}

    public function getPaginatedAnnouncements(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->announcementRepository->getPaginated($filters, $perPage);
    }

    public function getGuardianOptions(): Collection
    {
        return $this->userRepository->getParentsForAnnouncement();
    }

    public function sendAnnouncement(array $data, ?int $adminId): Announcement
    {
        $guardians = $this->resolveGuardians($data);

        if ($guardians->isEmpty()) {
            throw ValidationException::withMessages([
                'guardian_ids' => 'No guardians are available for this announcement.',
            ]);
        }

        $announcement = $this->announcementRepository->createWithRecipients([
            'created_by_id' => $adminId,
            'title' => $data['title'],
            'message' => $data['message'],
            'sms_enabled' => $data['sms_enabled'],
            'email_enabled' => $data['email_enabled'],
            'audience_type' => $data['audience_type'],
            'status' => AnnouncementStatus::SENT->value,
            'sent_at' => now(),
        ], $guardians);

        AnnouncementCreated::dispatch($announcement);

        return $announcement;
    }

    public function deliverRecipientChunk(int $announcementId, array $recipientIds): void
    {
        $announcement = $this->announcementRepository->findForDeliveryChunk(
            announcementId: $announcementId,
            recipientIds: $recipientIds
        );

        foreach ($announcement->recipients as $recipient) {
            $guardian = $recipient->guardian;
            $deliveryData = [];

            if ($announcement->email_enabled) {
                $deliveryData = [
                    ...$deliveryData,
                    ...$this->deliverEmail($announcement, $guardian),
                ];
            }

            if ($announcement->sms_enabled) {
                $deliveryData = [
                    ...$deliveryData,
                    ...$this->deliverSms($announcement, $guardian),
                ];
            }

            $this->announcementRepository->updateRecipientDelivery(
                $announcement,
                $recipient->guardian_id,
                $deliveryData
            );
        }
    }

    public function refreshDeliveryStatus(int $announcementId): void
    {
        $counts = $this->announcementRepository->getDeliveryStatusCounts($announcementId);

        if ($counts['failed'] < 1) {
            return;
        }

        $this->announcementRepository->updateStatusById($announcementId, [
            'status' => $counts['failed'] >= $counts['total'] ? AnnouncementStatus::FAILED->value : AnnouncementStatus::PARTIAL->value,
        ]);
    }

    protected function resolveGuardians(array $data): Collection
    {
        if ($data['audience_type'] === AnnouncementAudienceType::SELECTED_GUARDIANS->value) {
            return $this->userRepository->getParentsForAnnouncement($data['guardian_ids'] ?? []);
        }

        return $this->userRepository->getParentsForAnnouncement();
    }

    protected function deliverEmail(Announcement $announcement, User $guardian): array
    {
        if (! $guardian->notification_email_enabled) {
            return ['email_status' => AnnouncementDeliveryStatus::SKIPPED->value];
        }

        try {
            Mail::to($guardian->email)->send(new SchoolAnnouncementMail($announcement, $guardian));

            return [
                'email_status' => AnnouncementDeliveryStatus::SENT->value,
                'email_sent_at' => now(),
            ];
        } catch (Throwable $exception) {
            return [
                'email_status' => AnnouncementDeliveryStatus::FAILED->value,
                'error_message' => $exception->getMessage(),
            ];
        }
    }

    protected function deliverSms(Announcement $announcement, User $guardian): array
    {
        if (! $guardian->notification_sms_enabled || ! $guardian->guardian_phone) {
            return ['sms_status' => AnnouncementDeliveryStatus::SKIPPED->value];
        }

        try {
            $this->smsNotificationService->send($guardian->guardian_phone, "{$announcement->title}: {$announcement->message}");

            return [
                'sms_status' => AnnouncementDeliveryStatus::SENT->value,
                'sms_sent_at' => now(),
            ];
        } catch (Throwable $exception) {
            return [
                'sms_status' => AnnouncementDeliveryStatus::FAILED->value,
                'error_message' => $exception->getMessage(),
            ];
        }
    }
}
