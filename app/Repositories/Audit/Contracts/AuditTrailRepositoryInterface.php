<?php

namespace App\Repositories\Audit\Contracts;

use App\Models\AuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AuditTrailRepositoryInterface
{
    public function create(array $data): AuditLog;

    public function getPaginatedAuditLogs(array $filters = [], int $perPage = 12, string $pageName = 'audit_page'): LengthAwarePaginator;

    public function getPaginatedAttendanceChanges(array $filters = [], int $perPage = 12, string $pageName = 'attendance_page'): LengthAwarePaginator;

    public function getPaginatedNotificationHistory(array $filters = [], int $perPage = 12, string $pageName = 'notification_page'): LengthAwarePaginator;

    public function getSummary(): array;
}
