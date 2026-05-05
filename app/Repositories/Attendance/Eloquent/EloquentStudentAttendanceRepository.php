<?php

namespace App\Repositories\Attendance\Eloquent;

use App\Models\StudentAttendanceLog;
use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Carbon\CarbonInterface;

class EloquentStudentAttendanceRepository implements StudentAttendanceRepositoryInterface
{
    public function create(array $data): StudentAttendanceLog
    {
        return StudentAttendanceLog::create($data)->load('student.parents');
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
