<?php

namespace App\Repositories\Guardian\Eloquent;

use App\Models\AnnouncementRecipient;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Guardian\Contracts\GuardianPortalRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class EloquentGuardianPortalRepository implements GuardianPortalRepositoryInterface
{
    public function getGuardianWithChildren(int $guardianId): ?User
    {
        return User::query()
            ->with(['children.sections.gradeLevel', 'children.sections.schedule'])
            ->find($guardianId);
    }

    public function getChildAttendanceLogs(User $guardian, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->attendanceQuery($guardian, $filters)
            ->latest('scanned_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getChildAttendanceCollection(User $guardian, array $filters = []): Collection
    {
        return $this->attendanceQuery($guardian, $filters)
            ->orderBy('scanned_at')
            ->get();
    }

    public function getAnnouncementNotifications(User $guardian, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return AnnouncementRecipient::query()
            ->with(['announcement.creator', 'guardian'])
            ->where('guardian_id', $guardian->id)
            ->when($filters['notification_search'] ?? null, function (Builder $query, string $search): void {
                $query->whereHas('announcement', function (Builder $announcementQuery) use ($search): void {
                    $announcementQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%");
                });
            })
            ->when($filters['channel'] ?? null, function (Builder $query, string $channel): void {
                $column = $channel === 'sms' ? 'sms_status' : 'email_status';

                $query->whereNotNull($column);
            })
            ->when($filters['delivery_status'] ?? null, function (Builder $query, string $status): void {
                $query->where(function (Builder $statusQuery) use ($status): void {
                    $statusQuery
                        ->where('sms_status', $status)
                        ->orWhere('email_status', $status);
                });
            })
            ->when($filters['date_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('updated_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('updated_at', '<=', $date))
            ->latest('updated_at')
            ->paginate($perPage, ['*'], 'notifications_page')
            ->withQueryString();
    }

    private function attendanceQuery(User $guardian, array $filters): Builder
    {
        return StudentAttendanceLog::query()
            ->with(['student.sections.gradeLevel', 'student.sections.schedule', 'editHistory.editor'])
            ->whereIn('user_id', $this->childIdsForGuardian($guardian))
            ->when($filters['student_id'] ?? null, fn (Builder $query, $studentId) => $query->where('user_id', $studentId))
            ->when($filters['event_type'] ?? null, fn (Builder $query, string $eventType) => $query->where('event_type', $eventType))
            ->when($filters['date_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('scanned_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('scanned_at', '<=', $date))
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->whereHas('student', function (Builder $studentQuery) use ($search): void {
                    $studentQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('student_number', 'like', "%{$search}%");
                });
            });
    }

    private function childIdsForGuardian(User $guardian): array
    {
        return $guardian
            ->children()
            ->pluck('users.id')
            ->all();
    }
}
