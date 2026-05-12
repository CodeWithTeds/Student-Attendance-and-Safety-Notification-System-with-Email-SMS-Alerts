<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\StudentAttendanceLog;
use App\Models\User;

it('allows admins to view students with frequent absences or late records', function (): void {
    $admin = User::factory()->admin()->create();
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade 10',
        'code' => 'G10',
        'sort_order' => 10,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'St. James',
        'school_year' => '2026-2027',
    ]);
    $section->schedule()->create([
        'time_in' => '08:00',
        'time_out' => '16:00',
    ]);
    $flaggedStudent = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'name' => 'Frequent Late',
        'student_number' => '2026000201',
    ]);
    $steadyStudent = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'name' => 'Steady Student',
        'student_number' => '2026000202',
    ]);

    $section->students()->attach([$flaggedStudent->id, $steadyStudent->id]);

    foreach (['2026-05-11 08:30:00', '2026-05-12 08:45:00', '2026-05-13 07:55:00'] as $scannedAt) {
        StudentAttendanceLog::create([
            'user_id' => $flaggedStudent->id,
            'qr_code_value' => 'SASN-STUDENT|flagged|2026000201|student@example.test',
            'event_type' => AttendanceEventType::CHECK_IN->value,
            'scanned_at' => $scannedAt,
        ]);
    }

    foreach (['2026-05-11 07:50:00', '2026-05-12 07:55:00', '2026-05-13 07:58:00', '2026-05-14 07:56:00', '2026-05-15 07:59:00'] as $scannedAt) {
        StudentAttendanceLog::create([
            'user_id' => $steadyStudent->id,
            'qr_code_value' => 'SASN-STUDENT|steady|2026000202|student@example.test',
            'event_type' => AttendanceEventType::CHECK_IN->value,
            'scanned_at' => $scannedAt,
        ]);
    }

    $this->actingAs($admin)
        ->get('/admin/absentee-monitor?date_from=2026-05-11&date_to=2026-05-15&absence_threshold=2&late_threshold=2')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/absentee-monitor/index')
            ->where('summary.monitored_students', 2)
            ->where('summary.flagged_students', 1)
            ->where('rows.0.student.id', $flaggedStudent->id)
            ->where('rows.0.absence_count', 2)
            ->where('rows.0.late_count', 2)
        );
});
