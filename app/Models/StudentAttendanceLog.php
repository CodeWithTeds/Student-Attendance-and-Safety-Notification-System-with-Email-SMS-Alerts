<?php

namespace App\Models;

use App\Enums\AttendanceEventType;
use Database\Factories\StudentAttendanceLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'qr_code_value', 'event_type', 'scanned_at'])]
class StudentAttendanceLog extends Model
{
    /** @use HasFactory<StudentAttendanceLogFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'event_type' => AttendanceEventType::class,
            'scanned_at' => 'immutable_datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
