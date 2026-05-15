<?php

namespace App\Http\Controllers;

use App\Services\Dashboard\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService)
    {
    }

    public function index(Request $request)
    {
        $stats = $this->dashboardService->getAnalyticsData();
        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
