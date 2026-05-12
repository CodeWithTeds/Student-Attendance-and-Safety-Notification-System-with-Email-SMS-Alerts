<?php

namespace App\Services\Attendance;

use App\Enums\AttendanceEventType;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class AbsenteeMonitorService
{
    public function __construct(
        protected StudentAttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function getSectionsForDropdown(): Collection
    {
        return $this->attendanceRepository->getSectionsForDropdown();
    }

    public function getStudentsForDropdown(): Collection
    {
        return $this->attendanceRepository->getStudentsForDropdown();
    }

    public function getMonitor(array $filters): array
    {
        $filters = $this->withDefaults($filters);
        $schoolDays = $this->schoolDays($filters['date_from'], $filters['date_to']);
        $students = $this->attendanceRepository->getAbsenteeMonitorStudents($filters);
        $rows = $students
            ->map(fn ($student): array => $this->buildStudentRow($student, $schoolDays, $filters))
            ->filter(fn (array $row): bool => $row['absence_count'] >= $filters['absence_threshold']
                || $row['late_count'] >= $filters['late_threshold'])
            ->sortByDesc('risk_score')
            ->values();

        return [
            'rows' => $rows->all(),
            'summary' => [
                'monitored_students' => $students->count(),
                'flagged_students' => $rows->count(),
                'total_absences' => $rows->sum('absence_count'),
                'total_lates' => $rows->sum('late_count'),
                'school_days' => count($schoolDays),
            ],
            'filters' => $filters,
        ];
    }

    protected function withDefaults(array $filters): array
    {
        return [
            'date_from' => $filters['date_from'] ?? now()->startOfMonth()->toDateString(),
            'date_to' => $filters['date_to'] ?? now()->toDateString(),
            'student_id' => $filters['student_id'] ?? '',
            'section_id' => $filters['section_id'] ?? '',
            'absence_threshold' => (int) ($filters['absence_threshold'] ?? 3),
            'late_threshold' => (int) ($filters['late_threshold'] ?? 3),
        ];
    }

    protected function schoolDays(string $dateFrom, string $dateTo): array
    {
        return collect(CarbonPeriod::create($dateFrom, $dateTo))
            ->map(fn ($date): CarbonImmutable => CarbonImmutable::parse($date))
            ->reject(fn (CarbonImmutable $date): bool => $date->isWeekend())
            ->map(fn (CarbonImmutable $date): string => $date->toDateString())
            ->values()
            ->all();
    }

    protected function buildStudentRow($student, array $schoolDays, array $filters): array
    {
        $section = $student->sections->first();
        $schedule = $section?->schedule;
        $checkIns = $student->attendanceLogs->where('event_type', AttendanceEventType::CHECK_IN);
        $presentDays = $checkIns
            ->map(fn ($log): string => $log->scanned_at->toDateString())
            ->unique()
            ->values();
        $absentDates = collect($schoolDays)
            ->diff($presentDays)
            ->values();
        $lateLogs = $schedule
            ? $checkIns->filter(fn ($log): bool => $this->isLate($log->scanned_at, $schedule->time_in))
            : collect();
        $riskScore = ($absentDates->count() * 2) + $lateLogs->count();

        return [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'student_number' => $student->student_number,
            ],
            'section' => $section ? [
                'id' => $section->id,
                'name' => trim(($section->gradeLevel?->name ? $section->gradeLevel->name.' ' : '').$section->name),
                'school_year' => $section->school_year,
                'time_in' => $schedule?->time_in,
            ] : null,
            'absence_count' => $absentDates->count(),
            'late_count' => $lateLogs->count(),
            'present_days' => $presentDays->count(),
            'school_days' => count($schoolDays),
            'absence_dates' => $absentDates->take(8)->all(),
            'late_dates' => $lateLogs
                ->take(8)
                ->map(fn ($log): array => [
                    'date' => $log->scanned_at->toDateString(),
                    'time' => $log->scanned_at->timezone(config('app.timezone'))->format('h:i A'),
                ])
                ->values()
                ->all(),
            'risk_score' => $riskScore,
            'risk_level' => $this->riskLevel($riskScore, $filters),
        ];
    }

    protected function isLate(CarbonImmutable $scannedAt, string $timeIn): bool
    {
        $scheduled = CarbonImmutable::parse($scannedAt->toDateString().' '.$timeIn, config('app.timezone'));

        return $scannedAt->timezone(config('app.timezone'))->greaterThan($scheduled);
    }

    protected function riskLevel(int $riskScore, array $filters): string
    {
        $highRisk = ((int) $filters['absence_threshold'] * 2) + (int) $filters['late_threshold'];

        if ($riskScore >= $highRisk) {
            return 'high';
        }

        return 'watch';
    }
}
