<?php

namespace App\Services\Guardian;

use App\Models\User;
use App\Repositories\Guardian\Contracts\GuardianPortalRepositoryInterface;
use Illuminate\Validation\ValidationException;

class GuardianAnnouncementService
{
    public function __construct(
        protected GuardianPortalRepositoryInterface $guardianPortalRepository
    ) {}

    public function getAnnouncementData(User $guardian, array $filters): array
    {
        $guardian = $this->getGuardian($guardian->id);

        return [
            'guardian' => $guardian,
            'announcementNotifications' => $this->guardianPortalRepository->getAnnouncementNotifications($guardian, $filters, 15),
            'filters' => $filters,
            'summary' => [
                'total_children' => $guardian->children->count(),
                'sms_enabled' => (bool) $guardian->notification_sms_enabled,
                'email_enabled' => (bool) $guardian->notification_email_enabled,
                'sms_contact' => $guardian->guardian_phone,
                'email_contact' => $guardian->email,
            ],
        ];
    }

    private function getGuardian(int $guardianId): User
    {
        $guardian = $this->guardianPortalRepository->getGuardianWithChildren($guardianId);

        if (! $guardian) {
            throw ValidationException::withMessages([
                'guardian' => 'Guardian profile could not be found.',
            ]);
        }

        return $guardian;
    }
}
