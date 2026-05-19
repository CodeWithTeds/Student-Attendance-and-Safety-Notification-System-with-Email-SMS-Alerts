<?php

namespace App\Services\Dashboard;

use App\Enums\DashboardAttendancePeriod;
use App\Models\User;
use App\Repositories\Dashboard\DashboardRepository;

class DashboardService
{
    public function __construct(protected DashboardRepository $dashboardRepository) {}

    public function getAnalyticsData(User $user, DashboardAttendancePeriod $attendancePeriod): array
    {
        return $this->dashboardRepository->getAnalyticsStats($user, $attendancePeriod);
    }
}
