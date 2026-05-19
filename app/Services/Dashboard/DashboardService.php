<?php

namespace App\Services\Dashboard;

use App\Enums\DashboardAttendancePeriod;
use App\Models\User;
use App\Repositories\Dashboard\DashboardRepository;
use Carbon\CarbonImmutable;

class DashboardService
{
    public function __construct(protected DashboardRepository $dashboardRepository) {}

    public function getAnalyticsData(User $user, DashboardAttendancePeriod $attendancePeriod, CarbonImmutable $attendanceDate): array
    {
        return $this->dashboardRepository->getAnalyticsStats($user, $attendancePeriod, $attendanceDate);
    }
}
