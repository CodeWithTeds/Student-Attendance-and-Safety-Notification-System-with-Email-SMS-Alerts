<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\StudentAttendanceLog;
use App\Models\User;

it('allows admins to view attendance management records', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000011',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|view|2026000011|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get('/admin/attendance')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/attendance/index')
            ->has('attendanceRecords.data', 1)
            ->where('attendanceRecords.data.0.student.id', $student->id)
        );
});

it('allows admins to edit attendance and stores edit history', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
    ]);
    $attendanceLog = StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|edit|2026000012|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);
    $newScannedAt = now()->setTime(8, 15)->format('Y-m-d H:i:s');

    $this->actingAs($admin)
        ->put("/admin/attendance/{$attendanceLog->id}", [
            'event_type' => AttendanceEventType::CHECK_OUT->value,
            'scanned_at' => $newScannedAt,
            'note' => 'Corrected after gate log review.',
        ])
        ->assertRedirect(route('admin.attendance.index'));

    $this->assertDatabaseHas('student_attendance_logs', [
        'id' => $attendanceLog->id,
        'event_type' => AttendanceEventType::CHECK_OUT->value,
    ]);

    $this->assertDatabaseHas('student_attendance_log_edits', [
        'student_attendance_log_id' => $attendanceLog->id,
        'edited_by_id' => $admin->id,
        'old_event_type' => AttendanceEventType::CHECK_IN->value,
        'new_event_type' => AttendanceEventType::CHECK_OUT->value,
        'note' => 'Corrected after gate log review.',
    ]);
});
