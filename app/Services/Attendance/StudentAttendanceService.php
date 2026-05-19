<?php

namespace App\Services\Attendance;

use App\Enums\AttendanceEventType;
use App\Mail\StudentAttendanceNotification;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Mail;
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
        $requestedEventType = $data['event_type'] ?? null;
        $dayStartsAt = now()->startOfDay();
        $dayEndsAt = now()->endOfDay();
        $hasCheckInToday = $this->attendanceRepository->hasEventForStudentBetween(
            $student,
            AttendanceEventType::CHECK_IN,
            $dayStartsAt,
            $dayEndsAt
        );
        $hasCheckOutToday = $this->attendanceRepository->hasEventForStudentBetween(
            $student,
            AttendanceEventType::CHECK_OUT,
            $dayStartsAt,
            $dayEndsAt
        );
        $eventType = $this->resolveEventType($hasCheckInToday, $requestedEventType);

        $this->ensureScanIsAllowed($student, $hasCheckInToday, $hasCheckOutToday, $eventType);

        $latestScan = $this->attendanceRepository->latestForStudent($student);
        if (! $requestedEventType && $latestScan && $latestScan->scanned_at->diffInMinutes(now()) < 1) {
            throw ValidationException::withMessages([
                'qr_code_value' => sprintf(
                    'Attendance was just recorded as %s. Please wait before scanning this QR again.',
                    $latestScan->event_type?->pastTenseLabel() ?? 'recorded'
                ),
            ]);
        }

        $attendanceLog = $this->attendanceRepository->create([
            'user_id' => $student->id,
            'qr_code_value' => $data['qr_code_value'],
            'event_type' => $eventType->value,
            'scanned_at' => now(),
        ]);

        if ($attendanceLog->student && $attendanceLog->student->parents->isNotEmpty()) {
            Mail::to($attendanceLog->student->parents)
                ->queue(new StudentAttendanceNotification($attendanceLog));
        }

        return $attendanceLog;
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

    protected function resolveEventType(bool $hasCheckInToday, ?string $requestedEventType): AttendanceEventType
    {
        if ($requestedEventType) {
            return AttendanceEventType::from($requestedEventType);
        }

        if ($hasCheckInToday) {
            return AttendanceEventType::CHECK_OUT;
        }

        return AttendanceEventType::CHECK_IN;
    }

    protected function ensureScanIsAllowed(User $student, bool $hasCheckInToday, bool $hasCheckOutToday, AttendanceEventType $eventType): void
    {
        if ($hasCheckInToday && $hasCheckOutToday) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} already completed Time In and Time Out today.",
            ]);
        }

        if ($eventType === AttendanceEventType::CHECK_IN && $hasCheckInToday) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} is still timed in. Scan Time Out before another Time In.",
            ]);
        }

        if ($eventType === AttendanceEventType::CHECK_OUT && ! $hasCheckInToday) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} has no active Time In today. Scan Time In first.",
            ]);
        }

        if ($eventType === AttendanceEventType::CHECK_OUT && $hasCheckOutToday) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} already timed out today.",
            ]);
        }
    }
}
