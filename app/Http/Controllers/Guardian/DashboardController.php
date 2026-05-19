<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guardian\DashboardIndexRequest;
use App\Http\Resources\StudentAttendanceLogResource;
use App\Http\Resources\UserResource;
use App\Services\Guardian\GuardianDashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected GuardianDashboardService $dashboardService) {}

    public function index(DashboardIndexRequest $request): Response
    {
        $data = $this->dashboardService->getDashboardData($request->user(), $request->filters());

        return Inertia::render('parent/dashboard', [
            'guardian' => (new UserResource($data['guardian']))->resolve($request),
            'children' => UserResource::collection($data['children']),
            'attendanceRecords' => StudentAttendanceLogResource::collection($data['attendanceRecords']),
            'filters' => $data['filters'],
            'summary' => $data['summary'],
            'childSummaries' => $data['childSummaries'],
            'dailyTrend' => $data['dailyTrend'],
        ]);
    }
}
