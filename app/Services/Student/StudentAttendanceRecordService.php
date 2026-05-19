<?php

namespace App\Services\Student;

use App\Models\User;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StudentAttendanceRecordService
{
    public function __construct(
        protected StudentAttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function getPaginatedRecords(User $student, int $perPage = 15): LengthAwarePaginator
    {
        return $this->attendanceRepository->getPaginatedForStudent($student, $perPage);
    }
}
