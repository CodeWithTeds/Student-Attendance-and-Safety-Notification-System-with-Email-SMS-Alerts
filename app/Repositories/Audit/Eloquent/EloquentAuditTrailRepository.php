<?php

namespace App\Repositories\Audit\Eloquent;

use App\Enums\AuditLogCategory;
use App\Models\AnnouncementRecipient;
use App\Models\AuditLog;
use App\Models\StudentAttendanceLogEdit;
use App\Repositories\Audit\Contracts\AuditTrailRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentAuditTrailRepository implements AuditTrailRepositoryInterface
{
    public function create(array $data): AuditLog
    {
        return AuditLog::create($data);
    }

    public function getPaginatedAuditLogs(array $filters = [], int $perPage = 12, string $pageName = 'audit_page'): LengthAwarePaginator
    {
        return AuditLog::query()
            ->with('actor:id,name,email')
            ->when($filters['category'] ?? null, fn ($query, string $category) => $query->where('category', $category))
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('actor', function ($actorQuery) use ($search): void {
                            $actorQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($filters['date'] ?? null, fn ($query, string $date) => $query->whereDate('created_at', $date))
            ->latest()
            ->paginate($perPage, ['*'], $pageName)
            ->withQueryString();
    }

    public function getPaginatedAttendanceChanges(array $filters = [], int $perPage = 12, string $pageName = 'attendance_page'): LengthAwarePaginator
    {
        return StudentAttendanceLogEdit::query()
            ->with(['attendanceLog.student:id,name,email,student_number', 'editor:id,name,email'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('note', 'like', "%{$search}%")
                        ->orWhereHas('attendanceLog.student', function ($studentQuery) use ($search): void {
                            $studentQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('student_number', 'like', "%{$search}%");
                        })
                        ->orWhereHas('editor', function ($editorQuery) use ($search): void {
                            $editorQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($filters['date'] ?? null, fn ($query, string $date) => $query->whereDate('created_at', $date))
            ->latest()
            ->paginate($perPage, ['*'], $pageName)
            ->withQueryString();
    }

    public function getPaginatedNotificationHistory(array $filters = [], int $perPage = 12, string $pageName = 'notification_page'): LengthAwarePaginator
    {
        return AnnouncementRecipient::query()
            ->with(['announcement.creator:id,name,email', 'guardian:id,name,email,guardian_phone'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('error_message', 'like', "%{$search}%")
                        ->orWhereHas('announcement', function ($announcementQuery) use ($search): void {
                            $announcementQuery
                                ->where('title', 'like', "%{$search}%")
                                ->orWhere('message', 'like', "%{$search}%");
                        })
                        ->orWhereHas('guardian', function ($guardianQuery) use ($search): void {
                            $guardianQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($filters['date'] ?? null, fn ($query, string $date) => $query->whereDate('updated_at', $date))
            ->latest('updated_at')
            ->paginate($perPage, ['*'], $pageName)
            ->withQueryString();
    }

    public function getSummary(): array
    {
        return [
            'total_admin_logs' => AuditLog::count(),
            'admin_actions' => AuditLog::where('category', AuditLogCategory::ADMIN_ACTION->value)->count(),
            'attendance_changes' => StudentAttendanceLogEdit::count(),
            'notification_events' => AnnouncementRecipient::count(),
        ];
    }
}
