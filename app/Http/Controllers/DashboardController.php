<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\Dashboard\DashboardIndexRequest;
use App\Services\Dashboard\DashboardService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function index(DashboardIndexRequest $request): Response|RedirectResponse
    {
        if ($request->user()->role === UserRole::PARENT) {
            return to_route('parent.dashboard');
        }

        if ($request->user()->role === UserRole::OFFICE) {
            return to_route('office.announcements.index');
        }

        return Inertia::render('dashboard', [
            'stats' => $this->dashboardService->getAnalyticsData($request->user(), $request->attendancePeriod(), $request->attendanceDate()),
        ]);
    }
}
