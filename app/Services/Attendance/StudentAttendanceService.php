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
        
        $latestScan = $this->attendanceRepository->latestForStudent($student);
        if ($latestScan && $latestScan->scanned_at->diffInMinutes(now()) < 1) {
            throw ValidationException::withMessages([
                'qr_code_value' => 'Please wait at least 1 minute before scanning again to avoid duplicates.',
            ]);
        }

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
            // Validate schedule for checkout
            $section = $student->sections->first();
            if ($section && $section->schedule) {
                $timeOut = \Carbon\Carbon::parse($section->schedule->time_out);
                if (now()->format('H:i:s') < $timeOut->subMinutes(30)->format('H:i:s')) {
                    // Too early to check out
                    throw ValidationException::withMessages([
                        'qr_code_value' => 'Too early to check out. Your schedule ends at ' . $section->schedule->time_out,
                    ]);
                }
            }
            return AttendanceEventType::CHECK_OUT;
        }

        // Validate schedule for check in
        $section = $student->sections->first();
        if ($section && $section->schedule) {
            $timeIn = \Carbon\Carbon::parse($section->schedule->time_in);
            if (now()->format('H:i:s') > $timeIn->addHours(4)->format('H:i:s')) {
                // If it's more than 4 hours late, they are absent for the day.
                throw ValidationException::withMessages([
                    'qr_code_value' => 'You are marked as absent. It is too late to check in for your schedule.',
                ]);
            }
        }

        return AttendanceEventType::CHECK_IN;
    }
}
