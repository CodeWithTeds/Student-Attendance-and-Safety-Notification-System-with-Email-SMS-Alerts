<?php

namespace App\Repositories\Dashboard;

use App\Enums\AttendanceEventType;
use App\Enums\DashboardAttendancePeriod;
use App\Enums\UserRole;
use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DashboardRepository
{
    public function getAnalyticsStats(User $user, DashboardAttendancePeriod $attendancePeriod, CarbonImmutable $attendanceDate): array
    {
        $today = CarbonImmutable::today();
        $thirtyDaysAgo = $today->subDays(29)->startOfDay();
        $eightWeeksAgo = $today->subWeeks(7)->startOfWeek();
        $attendanceLogs = DB::table('student_attendance_logs')
            ->select(['event_type', 'scanned_at'])
            ->where('scanned_at', '>=', $eightWeeksAgo)
            ->get();

        return [
            'total_students' => DB::table('users')->where('role', 'student')->count(),
            'total_parents' => DB::table('users')->where('role', 'parent')->count(),
            'total_advisers' => DB::table('advisers')->count(),
            'total_sections' => DB::table('sections')->count(),
            'total_attendance_today' => DB::table('student_attendance_logs')
                ->whereDate('scanned_at', $today)
                ->count(),
            'attendance_trend' => $this->attendanceTrend($attendanceLogs, $today),
            'attendance_by_hour' => $this->attendanceByHour($attendanceLogs, $today),
            'weekly_activity' => $this->weeklyActivity($attendanceLogs, $today),
            'event_mix' => $this->eventMix($attendanceLogs, $thirtyDaysAgo),
            'role_distribution' => $this->roleDistribution(),
            'student_status_distribution' => $this->studentStatusDistribution(),
            'grade_level_distribution' => $this->gradeLevelDistribution(),
            'section_occupancy' => $this->sectionOccupancy(),
            'student_attendance_summary' => $this->studentAttendanceSummary($user, $attendancePeriod, $attendanceDate, $today),
        ];
    }

    private function attendanceTrend($attendanceLogs, CarbonImmutable $today): array
    {
        $start = $today->subDays(13);

        return collect(CarbonPeriod::create($start, $today))
            ->map(function ($date) use ($attendanceLogs) {
                $day = CarbonImmutable::parse($date)->toDateString();
                $logsForDay = $attendanceLogs->filter(fn ($log) => CarbonImmutable::parse($log->scanned_at)->toDateString() === $day);

                return [
                    'label' => CarbonImmutable::parse($date)->format('M j'),
                    'check_ins' => $logsForDay->where('event_type', 'check_in')->count(),
                    'check_outs' => $logsForDay->where('event_type', 'check_out')->count(),
                    'total' => $logsForDay->count(),
                ];
            })
            ->values()
            ->all();
    }

    private function attendanceByHour($attendanceLogs, CarbonImmutable $today): array
    {
        $logsForToday = $attendanceLogs->filter(fn ($log) => CarbonImmutable::parse($log->scanned_at)->isSameDay($today));

        return collect(range(6, 18, 2))
            ->map(function (int $hour) use ($logsForToday) {
                $nextHour = $hour + 2;

                return [
                    'label' => CarbonImmutable::createFromTime($hour)->format('ga'),
                    'value' => $logsForToday->filter(function ($log) use ($hour, $nextHour) {
                        $scannedHour = CarbonImmutable::parse($log->scanned_at)->hour;

                        return $scannedHour >= $hour && $scannedHour < $nextHour;
                    })->count(),
                ];
            })
            ->values()
            ->all();
    }

    private function weeklyActivity($attendanceLogs, CarbonImmutable $today): array
    {
        return collect(range(7, 0))
            ->map(function (int $weeksAgo) use ($attendanceLogs, $today) {
                $weekStart = $today->subWeeks($weeksAgo)->startOfWeek();
                $weekEnd = $weekStart->endOfWeek();
                $logsForWeek = $attendanceLogs->filter(function ($log) use ($weekStart, $weekEnd) {
                    $scannedAt = CarbonImmutable::parse($log->scanned_at);

                    return $scannedAt->betweenIncluded($weekStart, $weekEnd);
                });

                return [
                    'label' => $weekStart->format('M j'),
                    'value' => $logsForWeek->count(),
                ];
            })
            ->values()
            ->all();
    }

    private function eventMix($attendanceLogs, CarbonImmutable $since): array
    {
        $recentLogs = $attendanceLogs->filter(fn ($log) => CarbonImmutable::parse($log->scanned_at)->greaterThanOrEqualTo($since));

        return [
            [
                'label' => 'Check-ins',
                'value' => $recentLogs->where('event_type', 'check_in')->count(),
                'color' => '#10b981',
            ],
            [
                'label' => 'Check-outs',
                'value' => $recentLogs->where('event_type', 'check_out')->count(),
                'color' => '#f97316',
            ],
        ];
    }

    private function roleDistribution(): array
    {
        return DB::table('users')
            ->select('role', DB::raw('COUNT(*) as total'))
            ->groupBy('role')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'label' => Str::headline((string) $row->role),
                'value' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    private function studentStatusDistribution(): array
    {
        return DB::table('users')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->where('role', 'student')
            ->groupBy('status')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'label' => Str::headline((string) $row->status),
                'value' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    private function gradeLevelDistribution(): array
    {
        return DB::table('grade_levels')
            ->leftJoin('users', function ($join) {
                $join->on('users.grade_level_id', '=', 'grade_levels.id')
                    ->where('users.role', '=', 'student');
            })
            ->select('grade_levels.name', DB::raw('COUNT(users.id) as total'))
            ->groupBy('grade_levels.id', 'grade_levels.name', 'grade_levels.sort_order')
            ->orderBy('grade_levels.sort_order')
            ->orderBy('grade_levels.name')
            ->get()
            ->map(fn ($row) => [
                'label' => (string) $row->name,
                'value' => (int) $row->total,
            ])
            ->values()
            ->all();
    }

    private function sectionOccupancy(): array
    {
        return DB::table('sections')
            ->leftJoin('grade_levels', 'grade_levels.id', '=', 'sections.grade_level_id')
            ->leftJoin('section_student', 'section_student.section_id', '=', 'sections.id')
            ->select([
                'sections.name',
                'sections.capacity',
                'grade_levels.code as grade_code',
                DB::raw('COUNT(section_student.student_id) as enrolled'),
            ])
            ->groupBy('sections.id', 'sections.name', 'sections.capacity', 'grade_levels.code')
            ->orderByDesc('enrolled')
            ->limit(8)
            ->get()
            ->map(function ($row) {
                $enrolled = (int) $row->enrolled;
                $capacity = (int) ($row->capacity ?: max($enrolled, 1));

                return [
                    'label' => trim(($row->grade_code ? "{$row->grade_code} " : '').$row->name),
                    'value' => $enrolled,
                    'capacity' => $capacity,
                    'percent' => min(100, round(($enrolled / $capacity) * 100)),
                ];
            })
            ->values()
            ->all();
    }

    private function studentAttendanceSummary(User $user, DashboardAttendancePeriod $period, CarbonImmutable $selectedDate, CarbonImmutable $today): ?array
    {
        if (! $this->isStudent($user)) {
            return null;
        }

        [$startsAt, $endsAt] = $this->studentAttendanceRange($period, $selectedDate);
        $logs = DB::table('student_attendance_logs')
            ->select(['id', 'event_type', 'scanned_at'])
            ->where('user_id', $user->id)
            ->whereBetween('scanned_at', [$startsAt, $endsAt])
            ->orderBy('scanned_at')
            ->get();

        $checkIns = $logs->where('event_type', AttendanceEventType::CHECK_IN->value)->count();
        $checkOuts = $logs->where('event_type', AttendanceEventType::CHECK_OUT->value)->count();
        $activeDays = $logs
            ->map(fn ($log) => CarbonImmutable::parse($log->scanned_at)->toDateString())
            ->unique()
            ->count();
        $elapsedEndsAt = $endsAt->lessThan($today->endOfDay()) ? $endsAt : $today->endOfDay();
        $schoolDays = $this->schoolDaysBetween($startsAt, $elapsedEndsAt);

        return [
            'selected_period' => $period->value,
            'selected_date' => $selectedDate->toDateString(),
            'max_date' => $today->toDateString(),
            'range_label' => $this->studentAttendanceRangeLabel($period, $startsAt, $endsAt),
            'options' => collect(DashboardAttendancePeriod::cases())
                ->map(fn (DashboardAttendancePeriod $option) => [
                    'label' => $option->label(),
                    'value' => $option->value,
                ])
                ->values()
                ->all(),
            'totals' => [
                'check_ins' => $checkIns,
                'check_outs' => $checkOuts,
                'total' => $logs->count(),
                'active_days' => $activeDays,
                'attendance_rate' => $schoolDays > 0 ? min(100, round(($activeDays / $schoolDays) * 100)) : 0,
            ],
            'chart' => $this->studentAttendanceChart($logs, $period, $startsAt, $endsAt),
            'recent_logs' => $logs
                ->reverse()
                ->take(5)
                ->map(fn ($log) => [
                    'id' => (int) $log->id,
                    'event_type' => (string) $log->event_type,
                    'event_label' => $log->event_type === AttendanceEventType::CHECK_IN->value ? 'Time In' : 'Time Out',
                    'date' => CarbonImmutable::parse($log->scanned_at)->format('M j, Y'),
                    'time' => CarbonImmutable::parse($log->scanned_at)->format('g:i A'),
                ])
                ->values()
                ->all(),
        ];
    }

    private function isStudent(User $user): bool
    {
        if ($user->role instanceof UserRole) {
            return $user->role === UserRole::STUDENT;
        }

        return $user->role === UserRole::STUDENT->value;
    }

    private function studentAttendanceRange(DashboardAttendancePeriod $period, CarbonImmutable $today): array
    {
        return match ($period) {
            DashboardAttendancePeriod::DAY => [$today->startOfDay(), $today->endOfDay()],
            DashboardAttendancePeriod::WEEK => [$today->startOfWeek(), $today->endOfWeek()],
            DashboardAttendancePeriod::MONTH => [$today->startOfMonth(), $today->endOfMonth()],
        };
    }

    private function studentAttendanceRangeLabel(DashboardAttendancePeriod $period, CarbonImmutable $startsAt, CarbonImmutable $endsAt): string
    {
        return match ($period) {
            DashboardAttendancePeriod::DAY => $startsAt->format('F j, Y'),
            DashboardAttendancePeriod::WEEK => $startsAt->format('M j').' - '.$endsAt->format('M j, Y'),
            DashboardAttendancePeriod::MONTH => $startsAt->format('F Y'),
        };
    }

    private function studentAttendanceChart($logs, DashboardAttendancePeriod $period, CarbonImmutable $startsAt, CarbonImmutable $endsAt): array
    {
        return match ($period) {
            DashboardAttendancePeriod::DAY => collect(range(0, 21, 3))
                ->map(function (int $hour) use ($logs) {
                    $nextHour = $hour + 3;
                    $bucketLogs = $logs->filter(function ($log) use ($hour, $nextHour) {
                        $scannedHour = CarbonImmutable::parse($log->scanned_at)->hour;

                        return $scannedHour >= $hour && $scannedHour < $nextHour;
                    });

                    return $this->attendanceChartPoint(CarbonImmutable::createFromTime($hour)->format('ga'), $bucketLogs);
                })
                ->values()
                ->all(),
            DashboardAttendancePeriod::WEEK => collect(CarbonPeriod::create($startsAt, $endsAt))
                ->map(function ($date) use ($logs) {
                    $day = CarbonImmutable::parse($date);
                    $bucketLogs = $logs->filter(fn ($log) => CarbonImmutable::parse($log->scanned_at)->isSameDay($day));

                    return $this->attendanceChartPoint($day->format('D'), $bucketLogs);
                })
                ->values()
                ->all(),
            DashboardAttendancePeriod::MONTH => collect(CarbonPeriod::create($startsAt, '1 week', $endsAt))
                ->map(function ($weekStart, int $index) use ($logs, $endsAt) {
                    $startsOn = CarbonImmutable::parse($weekStart);
                    $weekEndsOn = $startsOn->addDays(6)->endOfDay();
                    $endsOn = $weekEndsOn->lessThan($endsAt) ? $weekEndsOn : $endsAt;
                    $bucketLogs = $logs->filter(function ($log) use ($startsOn, $endsOn) {
                        return CarbonImmutable::parse($log->scanned_at)->betweenIncluded($startsOn, $endsOn);
                    });

                    return $this->attendanceChartPoint('Week '.($index + 1), $bucketLogs);
                })
                ->values()
                ->all(),
        };
    }

    private function attendanceChartPoint(string $label, $logs): array
    {
        $checkIns = $logs->where('event_type', AttendanceEventType::CHECK_IN->value)->count();
        $checkOuts = $logs->where('event_type', AttendanceEventType::CHECK_OUT->value)->count();

        return [
            'label' => $label,
            'check_ins' => $checkIns,
            'check_outs' => $checkOuts,
            'total' => $checkIns + $checkOuts,
        ];
    }

    private function schoolDaysBetween(CarbonImmutable $startsAt, CarbonImmutable $endsAt): int
    {
        if ($startsAt->greaterThan($endsAt)) {
            return 0;
        }

        return collect(CarbonPeriod::create($startsAt->startOfDay(), $endsAt->startOfDay()))
            ->filter(fn ($date) => CarbonImmutable::parse($date)->isWeekday())
            ->count();
    }
}
