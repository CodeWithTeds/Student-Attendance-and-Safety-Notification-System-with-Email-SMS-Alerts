<?php

namespace App\Services\Guardian;

use App\Enums\AttendanceEventType;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Guardian\Contracts\GuardianPortalRepositoryInterface;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class GuardianNotificationService
{
    public function __construct(
        protected GuardianPortalRepositoryInterface $guardianPortalRepository
    ) {}

    public function getNotificationData(User $guardian, array $filters): array
    {
        $guardian = $this->getGuardian($guardian->id);
        $attendanceAlerts = $this->guardianPortalRepository->getChildAttendanceLogs($guardian, $filters);
        $summaryRecords = $this->guardianPortalRepository->getChildAttendanceCollection($guardian, $filters);
        $announcementNotifications = $this->guardianPortalRepository->getAnnouncementNotifications($guardian, $filters);

        return [
            'guardian' => $guardian,
            'children' => $guardian->children,
            'attendanceAlerts' => $attendanceAlerts,
            'announcementNotifications' => $announcementNotifications,
            'filters' => $filters,
            'summary' => $this->summary($guardian, $summaryRecords),
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

    private function summary(User $guardian, Collection $records): array
    {
        $lateAlerts = $records->filter(fn (StudentAttendanceLog $record): bool => $this->isLate($record))->count();

        return [
            'total_alerts' => $records->count(),
            'late_alerts' => $lateAlerts,
            'sms_enabled' => (bool) $guardian->notification_sms_enabled,
            'email_enabled' => (bool) $guardian->notification_email_enabled,
            'sms_contact' => $guardian->guardian_phone,
            'email_contact' => $guardian->email,
            'linked_children' => $guardian->children->count(),
        ];
    }

    private function isLate(StudentAttendanceLog $record): bool
    {
        if ($this->eventType($record) !== AttendanceEventType::CHECK_IN->value) {
            return false;
        }

        $schedule = $record->student?->sections?->first()?->schedule;

        if (! $schedule || ! $record->scanned_at) {
            return false;
        }

        $scannedAt = CarbonImmutable::instance($record->scanned_at)->timezone($this->timezone());
        $lateStartsAt = CarbonImmutable::parse($scannedAt->format('Y-m-d').' '.$schedule->time_in, $this->timezone())->addMinutes(20);

        return $scannedAt->gt($lateStartsAt);
    }

    private function eventType(StudentAttendanceLog $record): string
    {
        return $record->event_type instanceof AttendanceEventType
            ? $record->event_type->value
            : (string) $record->event_type;
    }

    private function timezone(): string
    {
        return (string) config('app.timezone', 'UTC');
    }
}
