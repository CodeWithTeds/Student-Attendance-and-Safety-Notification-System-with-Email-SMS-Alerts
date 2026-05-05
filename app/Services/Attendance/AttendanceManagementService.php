<?php

namespace App\Services\Attendance;

use App\Models\StudentAttendanceLog;
use App\Repositories\Attendance\Contracts\StudentAttendanceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AttendanceManagementService
{
    public function __construct(
        protected StudentAttendanceRepositoryInterface $attendanceRepository
    ) {}

    public function getPaginatedRecords(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->attendanceRepository->getPaginated($filters, $perPage);
    }

    public function updateAttendance(int $id, array $data): StudentAttendanceLog
    {
        $attendanceLog = $this->resolveAttendanceLog($id);
        $oldEventType = $attendanceLog->event_type;
        $oldScannedAt = $attendanceLog->scanned_at;

        $this->attendanceRepository->update($attendanceLog, [
            'event_type' => $data['event_type'],
            'scanned_at' => $data['scanned_at'],
        ]);

        $attendanceLog->refresh();

        $this->attendanceRepository->createEditHistory([
            'student_attendance_log_id' => $attendanceLog->id,
            'edited_by_id' => Auth::id(),
            'old_event_type' => $oldEventType->value,
            'new_event_type' => $attendanceLog->event_type->value,
            'old_scanned_at' => $oldScannedAt,
            'new_scanned_at' => $attendanceLog->scanned_at,
            'note' => $data['note'] ?? null,
        ]);

        return $this->resolveAttendanceLog($id);
    }

    protected function resolveAttendanceLog(int $id): StudentAttendanceLog
    {
        $attendanceLog = $this->attendanceRepository->getById($id);

        if (! $attendanceLog) {
            throw ValidationException::withMessages([
                'attendance' => 'Attendance record could not be found.',
            ]);
        }

        return $attendanceLog;
    }
}
