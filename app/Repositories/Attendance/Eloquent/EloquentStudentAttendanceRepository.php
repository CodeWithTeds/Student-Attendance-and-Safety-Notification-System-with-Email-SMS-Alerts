<?php

namespace App\Repositories\Attendance\Eloquent;

use App\Models\StudentAttendanceLog;
use App\Models\StudentAttendanceLogEdit;
use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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
}
