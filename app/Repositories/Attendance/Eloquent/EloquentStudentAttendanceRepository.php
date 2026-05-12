<?php

namespace App\Repositories\Attendance\Eloquent;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Section;
use App\Models\StudentAttendanceLog;
use App\Models\StudentAttendanceLogEdit;
use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentStudentAttendanceRepository implements StudentAttendanceRepositoryInterface
{
    public function create(array $data): StudentAttendanceLog
    {
        return StudentAttendanceLog::create($data)->load(['student.parents', 'student.sections.gradeLevel', 'student.sections.schedule']);
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return StudentAttendanceLog::query()
            ->with(['student.sections.gradeLevel', 'student.sections.schedule', 'editHistory.editor'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->whereHas('student', function ($studentQuery) use ($search): void {
                    $studentQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('student_number', 'like', "%{$search}%");
                });
            })
            ->when($filters['event_type'] ?? null, fn ($query, string $eventType) => $query->where('event_type', $eventType))
            ->when($filters['date'] ?? null, fn ($query, string $date) => $query->whereDate('scanned_at', $date))
            ->latest('scanned_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getById(int $id): ?StudentAttendanceLog
    {
        return StudentAttendanceLog::with(['student.sections.gradeLevel', 'student.sections.schedule', 'editHistory.editor'])->find($id);
    }

    public function update(StudentAttendanceLog $attendanceLog, array $data): bool
    {
        return $attendanceLog->update($data);
    }

    public function createEditHistory(array $data): StudentAttendanceLogEdit
    {
        return StudentAttendanceLogEdit::create($data);
    }

    public function latestForStudent(User $student): ?StudentAttendanceLog
    {
        return StudentAttendanceLog::where('user_id', $student->id)
            ->latest('scanned_at')
            ->first();
    }

    public function latestForStudentBetween(User $student, CarbonInterface $startsAt, CarbonInterface $endsAt): ?StudentAttendanceLog
    {
        return StudentAttendanceLog::where('user_id', $student->id)
            ->whereBetween('scanned_at', [$startsAt, $endsAt])
            ->latest('scanned_at')
            ->first();
    }

    public function getReportData(array $filters): Collection
    {
        return StudentAttendanceLog::query()
            ->with(['student.sections.gradeLevel'])
            ->when($filters['date_from'] ?? null, fn ($q, $d) => $q->whereDate('scanned_at', '>=', $d))
            ->when($filters['date_to'] ?? null, fn ($q, $d) => $q->whereDate('scanned_at', '<=', $d))
            ->when($filters['student_id'] ?? null, fn ($q, $id) => $q->where('user_id', $id))
            ->when($filters['section_id'] ?? null, function ($q, $sectionId): void {
                $q->whereHas('student.sections', fn ($sq) => $sq->where('sections.id', $sectionId));
            })
            ->orderBy('scanned_at')
            ->get();
    }

    public function getSectionsForDropdown(): Collection
    {
        return Section::query()
            ->with('gradeLevel')
            ->orderBy('name')
            ->get(['id', 'name', 'grade_level_id', 'school_year']);
    }

    public function getStudentsForDropdown(): Collection
    {
        return User::query()
            ->where('role', UserRole::STUDENT->value)
            ->orderBy('name')
            ->get(['id', 'name', 'student_number']);
    }

    public function getAbsenteeMonitorStudents(array $filters = []): Collection
    {
        return User::query()
            ->with([
                'sections.gradeLevel',
                'sections.schedule',
                'attendanceLogs' => function ($query) use ($filters): void {
                    $query
                        ->when($filters['date_from'] ?? null, fn ($q, $date) => $q->whereDate('scanned_at', '>=', $date))
                        ->when($filters['date_to'] ?? null, fn ($q, $date) => $q->whereDate('scanned_at', '<=', $date))
                        ->orderBy('scanned_at');
                },
            ])
            ->where('role', UserRole::STUDENT->value)
            ->where('status', UserStatus::APPROVED->value)
            ->when($filters['student_id'] ?? null, fn ($query, $studentId) => $query->whereKey($studentId))
            ->when($filters['section_id'] ?? null, function ($query, $sectionId): void {
                $query->whereHas('sections', fn ($sectionQuery) => $sectionQuery->where('sections.id', $sectionId));
            })
            ->orderBy('name')
            ->get();
    }
}
