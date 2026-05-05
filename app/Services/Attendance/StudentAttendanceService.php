<?php

namespace App\Services\Attendance;

use App\Enums\AttendanceEventType;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Illuminate\Validation\ValidationException;

class StudentAttendanceService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected StudentAttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function recordScan(array $data): StudentAttendanceLog
    {
        $student = $this->resolveStudent($data['qr_code_value']);
        $eventType = $this->resolveEventType($student, $data['event_type'] ?? null);

        return $this->attendanceRepository->create([
            'user_id' => $student->id,
            'qr_code_value' => $data['qr_code_value'],
            'event_type' => $eventType->value,
            'scanned_at' => now(),
        ]);
    }

    protected function resolveStudent(string $qrCodeValue): User
    {
        $student = $this->userRepository->findApprovedStudentByQrCode($qrCodeValue);

        if (! $student) {
            throw ValidationException::withMessages([
                'qr_code_value' => 'This QR code is not assigned to an approved student.',
            ]);
        }

        return $student;
    }

    protected function resolveEventType(User $student, ?string $requestedEventType): AttendanceEventType
    {
        if ($requestedEventType) {
            return AttendanceEventType::from($requestedEventType);
        }

        $latestToday = $this->attendanceRepository->latestForStudentBetween(
            $student,
            now()->startOfDay(),
            now()->endOfDay()
        );

        if ($latestToday?->event_type === AttendanceEventType::CHECK_IN) {
            return AttendanceEventType::CHECK_OUT;
        }

        return AttendanceEventType::CHECK_IN;
    }
}
