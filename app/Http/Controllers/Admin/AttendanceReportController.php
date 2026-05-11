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
        $filters = $request->only(['date_from', 'date_to', 'student_id', 'section_id']);

        // Default to current month if no dates provided
        if (empty($filters['date_from'])) {
            $filters['date_from'] = now()->startOfMonth()->toDateString();
        }
        if (empty($filters['date_to'])) {
            $filters['date_to'] = now()->toDateString();
        }

        return Inertia::render('admin/reports/index', [
            'sections' => $this->reportService->getSectionsForDropdown(),
            'students' => $this->reportService->getStudentsForDropdown(),
            'filters'  => $filters,
            'report'   => $this->reportService->generateAllReports($filters),
        ]);
    }

}
