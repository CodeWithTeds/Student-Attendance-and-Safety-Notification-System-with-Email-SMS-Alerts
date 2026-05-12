<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditLogCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Export\AttendanceReportExportRequest;
use App\Services\Attendance\AttendanceReportService;
use App\Services\Audit\AuditTrailService;
use App\Services\Export\AttendanceReportExportService;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ExportManagementController extends Controller
{
    public function __construct(
        protected AttendanceReportService $reportService,
        protected AttendanceReportExportService $exportService,
        protected AuditTrailService $auditTrailService
    ) {}

    public function index(Request $request): Response
    {
        $filters = $this->filtersWithDefaults($request);

        return Inertia::render('admin/exports/index', [
            'sections' => $this->reportService->getSectionsForDropdown(),
            'students' => $this->reportService->getStudentsForDropdown(),
            'filters' => $filters,
            'report' => $this->reportService->generateReport($filters),
        ]);
    }

    public function download(AttendanceReportExportRequest $request): SymfonyResponse
    {
        $filters = $request->reportFilters();
        $format = $request->exportFormat();
        $report = $this->reportService->generateReport($filters);
        $filename = $this->exportService->filename($filters, $format);

        $this->auditTrailService->record(
            AuditLogCategory::ADMIN_ACTION,
            'admin.attendance_report_exported',
            "Exported {$filters['report_type']} attendance report as {$format}.",
            null,
            [
                'format' => $format,
                'filters' => $filters,
                'row_count' => count($report['rows']),
            ]
        );

        if ($format === 'pdf') {
            return response($this->exportService->buildPdf($report, $filters), HttpResponse::HTTP_OK, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }

        return response($this->exportService->buildCsv($report, $filters), HttpResponse::HTTP_OK, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    protected function filtersWithDefaults(Request $request): array
    {
        return [
            'report_type' => $request->input('report_type', 'daily'),
            'date_from' => $request->input('date_from', now()->startOfMonth()->toDateString()),
            'date_to' => $request->input('date_to', now()->toDateString()),
            'student_id' => $request->input('student_id', ''),
            'section_id' => $request->input('section_id', ''),
        ];
    }
}
