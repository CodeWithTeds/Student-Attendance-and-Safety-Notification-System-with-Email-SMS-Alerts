<?php

namespace App\Services\Attendance;

use App\Enums\AttendanceEventType;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Illuminate\Support\Collection;

class AttendanceReportService
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

    public function generateReport(array $filters): array
    {
        $logs = $this->attendanceRepository->getReportData($filters);

        $rows = match ($filters['report_type']) {
            'daily'       => $this->groupByDaily($logs),
            'weekly'      => $this->groupByWeekly($logs),
            'monthly'     => $this->groupByMonthly($logs),
            'per_student' => $this->groupByStudent($logs),
            'per_section' => $this->groupBySection($logs),
            default       => collect(),
        };

        return [
            'rows'    => $rows->values()->all(),
            'summary' => $this->buildSummary($logs),
        ];
    }

    public function generateAllReports(array $filters): array
    {
        $logs = $this->attendanceRepository->getReportData($filters);

        return [
            'summary'     => $this->buildSummary($logs),
            'daily'       => $this->groupByDaily($logs)->values()->all(),
            'weekly'      => $this->groupByWeekly($logs)->values()->all(),
            'monthly'     => $this->groupByMonthly($logs)->values()->all(),
            'per_student' => $this->groupByStudent($logs)->values()->all(),
            'per_section' => $this->groupBySection($logs)->values()->all(),
        ];
    }

    // ─── Grouping strategies ────────────────────────────────────────────────

    private function groupByDaily(Collection $logs): Collection
    {
        return $logs
            ->groupBy(fn ($log) => $log->scanned_at->toDateString())
            ->map(function (Collection $group, string $date) {
                return $this->buildRow($date, $group);
            });
    }

    private function groupByWeekly(Collection $logs): Collection
    {
        return $logs
            ->groupBy(fn ($log) => $log->scanned_at->format('o-\WW'))
            ->map(function (Collection $group, string $week) {
                $start = $group->first()->scanned_at->startOfWeek()->toDateString();
                $end   = $group->first()->scanned_at->endOfWeek()->toDateString();
                $label = "Week {$week} ({$start} – {$end})";

                return $this->buildRow($label, $group);
            });
    }

    private function groupByMonthly(Collection $logs): Collection
    {
        return $logs
            ->groupBy(fn ($log) => $log->scanned_at->format('Y-m'))
            ->map(function (Collection $group, string $month) {
                $label = $group->first()->scanned_at->format('F Y');

                return $this->buildRow($label, $group);
            });
    }

    private function groupByStudent(Collection $logs): Collection
    {
        return $logs
            ->groupBy('user_id')
            ->map(function (Collection $group) {
                $student = $group->first()->student;
                $label   = $student
                    ? ($student->name.($student->student_number ? ' ('.$student->student_number.')' : ''))
                    : 'Unknown Student';

                return $this->buildRow($label, $group);
            });
    }

    private function groupBySection(Collection $logs): Collection
    {
        return $logs
            ->groupBy(function ($log) {
                $section = $log->student?->sections->first();

                return $section ? $section->id : 0;
            })
            ->map(function (Collection $group, int|string $sectionId) {
                $section = $group->first()->student?->sections->first();
                $label   = $section
                    ? (($section->gradeLevel?->name ? $section->gradeLevel->name.' ' : '').$section->name)
                    : 'Unassigned';

                return $this->buildRow($label, $group);
            });
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private function buildRow(string $label, Collection $group): array
    {
        $checkIns  = $group->where('event_type', AttendanceEventType::CHECK_IN)->count();
        $checkOuts = $group->where('event_type', AttendanceEventType::CHECK_OUT)->count();

        return [
            'label'      => $label,
            'check_ins'  => $checkIns,
            'check_outs' => $checkOuts,
            'total'      => $group->count(),
        ];
    }

    private function buildSummary(Collection $logs): array
    {
        return [
            'total_records'    => $logs->count(),
            'total_check_ins'  => $logs->where('event_type', AttendanceEventType::CHECK_IN)->count(),
            'total_check_outs' => $logs->where('event_type', AttendanceEventType::CHECK_OUT)->count(),
            'unique_students'  => $logs->pluck('user_id')->unique()->count(),
        ];
    }
}
