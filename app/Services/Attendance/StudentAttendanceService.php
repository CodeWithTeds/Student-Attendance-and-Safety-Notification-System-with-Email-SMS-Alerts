<?php

namespace App\Services\Attendance;

use App\Enums\AttendanceEventType;
use App\Mail\StudentAttendanceNotification;
use App\Models\SectionSchedule;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
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
        $scannedAt = now();
        $dayStartsAt = $scannedAt->copy()->startOfDay();
        $dayEndsAt = $scannedAt->copy()->endOfDay();
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

        $this->ensureScanIsAllowed($student, $hasCheckInToday, $hasCheckOutToday, $eventType, $scannedAt);

        $latestScan = $this->attendanceRepository->latestForStudent($student);
        if (! $requestedEventType && $latestScan && $latestScan->scanned_at->diffInMinutes($scannedAt) < 1) {
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
            'scanned_at' => $scannedAt,
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

    protected function ensureScanIsAllowed(User $student, bool $hasCheckInToday, bool $hasCheckOutToday, AttendanceEventType $eventType, CarbonInterface $scannedAt): void
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

        $schedule = $this->studentSchedule($student);

        if (! $schedule) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} has no section schedule assigned. Please contact the registrar before scanning attendance.",
            ]);
        }

        $this->ensureScheduleAllowsScan($student, $schedule, $eventType, $scannedAt);
    }

    protected function studentSchedule(User $student): ?SectionSchedule
    {
        $section = $student->relationLoaded('sections') ? $student->sections->first() : null;

        if (! $section || ! $section->relationLoaded('schedule')) {
            return null;
        }

        return $section->schedule;
    }

    protected function ensureScheduleAllowsScan(User $student, SectionSchedule $schedule, AttendanceEventType $eventType, CarbonInterface $scannedAt): void
    {
        $timezone = $this->appTimezone();
        $scannedAtLocal = CarbonImmutable::instance($scannedAt)->timezone($timezone);
        $scheduledTimeIn = $this->scheduledTime($schedule->time_in, $scannedAtLocal);
        $scheduledTimeOut = $this->scheduledTime($schedule->time_out, $scannedAtLocal);

        if ($eventType === AttendanceEventType::CHECK_IN && $scannedAtLocal->lt($scheduledTimeIn->subHour())) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} can only Time In within 1 hour before the scheduled Time In at {$this->displayTime($schedule->time_in)}.",
            ]);
        }

        if ($eventType === AttendanceEventType::CHECK_OUT && $scannedAtLocal->lt($scheduledTimeOut)) {
            throw ValidationException::withMessages([
                'qr_code_value' => "{$student->name} can only Time Out at or after the scheduled Time Out at {$this->displayTime($schedule->time_out)}.",
            ]);
        }
    }

    protected function scheduledTime(string $time, CarbonInterface $scannedAt): CarbonImmutable
    {
        return CarbonImmutable::parse($scannedAt->format('Y-m-d').' '.$time, $this->appTimezone());
    }

    protected function displayTime(string $time): string
    {
        return CarbonImmutable::parse($time, $this->appTimezone())->format('h:i A');
    }

    protected function appTimezone(): string
    {
        return (string) config('app.timezone', 'UTC');
    }
}
