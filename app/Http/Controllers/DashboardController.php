<?php

namespace App\Http\Controllers;

use App\Http\Requests\Dashboard\DashboardIndexRequest;
use App\Services\Dashboard\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function index(DashboardIndexRequest $request): Response
    {
        return Inertia::render('dashboard', [
            'stats' => $this->dashboardService->getAnalyticsData($request->user(), $request->attendancePeriod()),
        ]);
    }
}
