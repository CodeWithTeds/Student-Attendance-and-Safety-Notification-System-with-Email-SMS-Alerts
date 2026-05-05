<?php

namespace App\Models;

use App\Enums\AttendanceEventType;
use Database\Factories\StudentAttendanceLogEditFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_attendance_log_id', 'edited_by_id', 'old_event_type', 'new_event_type', 'old_scanned_at', 'new_scanned_at', 'note'])]
class StudentAttendanceLogEdit extends Model
{
    /** @use HasFactory<StudentAttendanceLogEditFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'old_event_type' => AttendanceEventType::class,
            'new_event_type' => AttendanceEventType::class,
            'old_scanned_at' => 'immutable_datetime',
            'new_scanned_at' => 'immutable_datetime',
        ];
    }

    public function attendanceLog(): BelongsTo
    {
        return $this->belongsTo(StudentAttendanceLog::class, 'student_attendance_log_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'edited_by_id');
    }
}
