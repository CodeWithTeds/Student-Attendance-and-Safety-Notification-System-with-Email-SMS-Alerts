<?php

namespace App\Services\Guardian;

use App\Models\User;

class GuardianAttendanceMonitoringService
{
    public function __construct(
        protected GuardianDashboardService $dashboardService
    ) {}

    public function getMonitoringData(User $guardian, array $filters): array
    {
        return $this->dashboardService->getDashboardData($guardian, $filters);
    }
}
