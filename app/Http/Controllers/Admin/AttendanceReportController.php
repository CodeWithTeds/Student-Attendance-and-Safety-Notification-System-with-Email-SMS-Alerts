<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\AttendanceReportRequest;
use App\Services\Attendance\AttendanceReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceReportController extends Controller
{
    public function __construct(
        protected AttendanceReportService $reportService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/reports/index', [
            'sections' => $this->reportService->getSectionsForDropdown(),
            'students' => $this->reportService->getStudentsForDropdown(),
            'filters'  => $request->only(['report_type', 'date_from', 'date_to', 'student_id', 'section_id']),
            'report'   => null,
        ]);
    }

    public function generate(AttendanceReportRequest $request): Response
    {
        return Inertia::render('admin/reports/index', [
            'sections' => $this->reportService->getSectionsForDropdown(),
            'students' => $this->reportService->getStudentsForDropdown(),
            'filters'  => $request->reportFilters(),
            'report'   => $this->reportService->generateAllReports($request->reportFilters()),
        ]);
    }
}
