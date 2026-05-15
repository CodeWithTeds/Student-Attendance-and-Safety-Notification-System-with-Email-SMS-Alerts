<?php

namespace App\Services\Dashboard;

use App\Repositories\Dashboard\DashboardRepository;

class DashboardService
{
    public function __construct(protected DashboardRepository $dashboardRepository)
    {
    }

    public function getAnalyticsData(): array
    {
        return $this->dashboardRepository->getAnalyticsStats();
    }
}
