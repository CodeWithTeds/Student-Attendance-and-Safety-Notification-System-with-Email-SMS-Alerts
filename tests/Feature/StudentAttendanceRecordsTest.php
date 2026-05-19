<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\StudentAttendanceLog;
use App\Models\User;

it('allows students to view only their own attendance records', function (): void {
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000101',
    ]);
    $otherStudent = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000102',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|records|2026000101|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);
    StudentAttendanceLog::create([
        'user_id' => $otherStudent->id,
        'qr_code_value' => 'SASN-STUDENT|records|2026000102|other@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 5),
    ]);

    $this->actingAs($student)
        ->get('/student/attendance-records')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/attendance-records')
            ->has('attendanceRecords.data', 1)
            ->where('attendanceRecords.data.0.student.id', $student->id)
        );
});

it('prevents non-students from opening student attendance records', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/student/attendance-records')
        ->assertForbidden();
});
