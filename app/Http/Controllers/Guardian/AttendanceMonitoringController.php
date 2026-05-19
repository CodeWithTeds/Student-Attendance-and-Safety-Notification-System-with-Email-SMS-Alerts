<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guardian\AttendanceMonitoringIndexRequest;
use App\Http\Resources\StudentAttendanceLogResource;
use App\Http\Resources\UserResource;
use App\Services\Guardian\GuardianAttendanceMonitoringService;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceMonitoringController extends Controller
{
    public function __construct(protected GuardianAttendanceMonitoringService $attendanceMonitoringService) {}

    public function index(AttendanceMonitoringIndexRequest $request): Response
    {
        $data = $this->attendanceMonitoringService->getMonitoringData($request->user(), $request->filters());

        return Inertia::render('parent/attendance-monitoring', [
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
