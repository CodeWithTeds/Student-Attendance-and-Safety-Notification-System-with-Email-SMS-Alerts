<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AuditLogCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Audit\AuditTrailIndexRequest;
use App\Http\Resources\AttendanceChangeAuditResource;
use App\Http\Resources\AuditLogResource;
use App\Http\Resources\NotificationHistoryResource;
use App\Services\Audit\AuditTrailService;
use Inertia\Inertia;
use Inertia\Response;

class AuditTrailController extends Controller
{
    public function __construct(
        protected AuditTrailService $auditTrailService
    ) {}

    public function index(AuditTrailIndexRequest $request): Response
    {
        return Inertia::render('admin/audit-trail/index', [
            'auditLogs' => AuditLogResource::collection($this->auditTrailService->getAuditLogs($request->filters())),
            'attendanceChanges' => AttendanceChangeAuditResource::collection($this->auditTrailService->getAttendanceChanges($request->filters())),
            'notificationHistory' => NotificationHistoryResource::collection($this->auditTrailService->getNotificationHistory($request->filters())),
            'summary' => $this->auditTrailService->getSummary(),
            'categories' => collect(AuditLogCategory::cases())->map(fn (AuditLogCategory $category): array => [
                'value' => $category->value,
                'label' => $category->label(),
            ])->values(),
            'filters' => $request->filters(),
        ]);
    }
}
