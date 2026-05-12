<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\AbsenteeMonitorRequest;
use App\Services\Attendance\AbsenteeMonitorService;
use Inertia\Inertia;
use Inertia\Response;

class AbsenteeMonitorController extends Controller
{
    public function __construct(
        protected AbsenteeMonitorService $absenteeMonitorService
    ) {}

    public function index(AbsenteeMonitorRequest $request): Response
    {
        $monitor = $this->absenteeMonitorService->getMonitor($request->filters());

        return Inertia::render('admin/absentee-monitor/index', [
            'sections' => $this->absenteeMonitorService->getSectionsForDropdown(),
            'students' => $this->absenteeMonitorService->getStudentsForDropdown(),
            'filters' => $monitor['filters'],
            'summary' => $monitor['summary'],
            'rows' => $monitor['rows'],
        ]);
    }
}
