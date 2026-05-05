<?php

namespace App\Repositories\Attendance\Contracts;

use App\Models\StudentAttendanceLog;
use App\Models\StudentAttendanceLogEdit;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StudentAttendanceRepositoryInterface
{
    public function create(array $data): StudentAttendanceLog;

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getById(int $id): ?StudentAttendanceLog;

    public function update(StudentAttendanceLog $attendanceLog, array $data): bool;

    public function createEditHistory(array $data): StudentAttendanceLogEdit;

    public function latestForStudent(User $student): ?StudentAttendanceLog;

    public function latestForStudentBetween(User $student, CarbonInterface $startsAt, CarbonInterface $endsAt): ?StudentAttendanceLog;
}
