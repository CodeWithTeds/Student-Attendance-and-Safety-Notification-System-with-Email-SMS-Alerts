<?php

namespace App\Repositories\Attendance\Contracts;

use App\Models\StudentAttendanceLog;
use App\Models\User;
use Carbon\CarbonInterface;

interface StudentAttendanceRepositoryInterface
{
    public function create(array $data): StudentAttendanceLog;

    public function latestForStudent(User $student): ?StudentAttendanceLog;

    public function latestForStudentBetween(User $student, CarbonInterface $startsAt, CarbonInterface $endsAt): ?StudentAttendanceLog;
}
