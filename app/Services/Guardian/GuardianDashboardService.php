<?php

namespace App\Services\Guardian;

use App\Enums\AttendanceEventType;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Guardian\Contracts\GuardianPortalRepositoryInterface;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class GuardianDashboardService
{
    public function __construct(
        protected GuardianPortalRepositoryInterface $guardianPortalRepository
    ) {}

    public function getDashboardData(User $guardian, array $filters): array
    {
        $guardian = $this->getGuardian($guardian->id);
        $records = $this->guardianPortalRepository->getChildAttendanceLogs($guardian, $filters);
        $summaryRecords = $this->guardianPortalRepository->getChildAttendanceCollection($guardian, $filters);

        return [
            'guardian' => $guardian,
            'children' => $guardian->children,
            'attendanceRecords' => $records,
            'filters' => $filters,
            'summary' => $this->summary($guardian->children, $summaryRecords),
            'childSummaries' => $this->childSummaries($guardian->children, $summaryRecords),
            'dailyTrend' => $this->dailyTrend($summaryRecords, $filters),
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

    private function summary(Collection $children, Collection $records): array
    {
        $late = $records->filter(fn (StudentAttendanceLog $record): bool => $this->scheduleStatus($record) === 'Late')->count();
        $checkIns = $records->filter(fn (StudentAttendanceLog $record): bool => $this->eventType($record) === AttendanceEventType::CHECK_IN->value)->count();
        $checkOuts = $records->filter(fn (StudentAttendanceLog $record): bool => $this->eventType($record) === AttendanceEventType::CHECK_OUT->value)->count();

        return [
            'children' => $children->count(),
            'total_logs' => $records->count(),
            'check_ins' => $checkIns,
            'check_outs' => $checkOuts,
            'late' => $late,
            'on_time' => max($checkIns - $late, 0),
            'completed' => $checkOuts,
        ];
    }

    private function childSummaries(Collection $children, Collection $records): array
    {
        return $children
            ->map(function (User $child) use ($records): array {
                $childRecords = $records->where('user_id', $child->id);
                $latest = $childRecords->sortByDesc('scanned_at')->first();
                $section = $child->sections->first();

                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'student_number' => $child->student_number,
                    'section' => $section ? trim(($section->gradeLevel?->name ?? '').' '.$section->name) : 'Not assigned',
                    'schedule' => $section?->schedule ? $this->scheduleDisplay($section->schedule->time_in, $section->schedule->time_out) : 'No schedule',
                    'check_ins' => $childRecords->filter(fn (StudentAttendanceLog $record): bool => $this->eventType($record) === AttendanceEventType::CHECK_IN->value)->count(),
                    'check_outs' => $childRecords->filter(fn (StudentAttendanceLog $record): bool => $this->eventType($record) === AttendanceEventType::CHECK_OUT->value)->count(),
                    'late' => $childRecords->filter(fn (StudentAttendanceLog $record): bool => $this->scheduleStatus($record) === 'Late')->count(),
                    'last_seen' => $latest ? $this->dateTimeDisplay($latest->scanned_at) : 'No scans yet',
                ];
            })
            ->values()
            ->all();
    }

    private function dailyTrend(Collection $records, array $filters): array
    {
        $timezone = $this->timezone();
        $start = CarbonImmutable::parse($filters['date_from'], $timezone)->startOfDay();
        $end = CarbonImmutable::parse($filters['date_to'], $timezone)->startOfDay();
        $days = (int) min($start->diffInDays($end), 30);

        return collect(range(0, $days))
            ->map(function (int $offset) use ($records, $start, $timezone): array {
                $date = $start->addDays($offset);
                $dayRecords = $records->filter(fn (StudentAttendanceLog $record): bool => $record->scanned_at?->timezone($timezone)->toDateString() === $date->toDateString());

                return [
                    'label' => $date->format('M d'),
                    'date' => $date->toDateString(),
                    'check_ins' => $dayRecords->filter(fn (StudentAttendanceLog $record): bool => $this->eventType($record) === AttendanceEventType::CHECK_IN->value)->count(),
                    'check_outs' => $dayRecords->filter(fn (StudentAttendanceLog $record): bool => $this->eventType($record) === AttendanceEventType::CHECK_OUT->value)->count(),
                    'late' => $dayRecords->filter(fn (StudentAttendanceLog $record): bool => $this->scheduleStatus($record) === 'Late')->count(),
                    'total' => $dayRecords->count(),
                ];
            })
            ->all();
    }

    private function scheduleStatus(StudentAttendanceLog $record): string
    {
        if ($this->eventType($record) === AttendanceEventType::CHECK_OUT->value) {
            return 'Completed';
        }

        $schedule = $record->student?->sections?->first()?->schedule;

        if (! $schedule || ! $record->scanned_at) {
            return 'On Time';
        }

        $scannedAt = CarbonImmutable::instance($record->scanned_at)->timezone($this->timezone());
        $lateStartsAt = CarbonImmutable::parse($scannedAt->format('Y-m-d').' '.$schedule->time_in, $this->timezone())->addMinutes(20);

        return $scannedAt->gt($lateStartsAt) ? 'Late' : 'On Time';
    }

    private function eventType(StudentAttendanceLog $record): string
    {
        return $record->event_type instanceof AttendanceEventType
            ? $record->event_type->value
            : (string) $record->event_type;
    }

    private function scheduleDisplay(string $timeIn, string $timeOut): string
    {
        return $this->timeDisplay($timeIn).' - '.$this->timeDisplay($timeOut);
    }

    private function timeDisplay(string $time): string
    {
        $format = strlen($time) === 5 ? 'H:i' : 'H:i:s';

        return CarbonImmutable::createFromFormat($format, $time, $this->timezone())->format('h:i A');
    }

    private function dateTimeDisplay($dateTime): string
    {
        return CarbonImmutable::instance($dateTime)->timezone($this->timezone())->format('M d, Y h:i A');
    }

    private function timezone(): string
    {
        return (string) config('app.timezone', 'UTC');
    }
}
