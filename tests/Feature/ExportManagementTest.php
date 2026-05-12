<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\StudentAttendanceLog;
use App\Models\User;

it('allows admins to view export management', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000101',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|export-view|2026000101|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);

    $this->actingAs($admin)
        ->get('/admin/exports')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/exports/index')
            ->where('report.summary.total_records', 1)
            ->has('students', 1)
        );
});

it('exports attendance reports as csv', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000102',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|export-csv|2026000102|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => '2026-05-12 08:00:00',
    ]);

    $response = $this->actingAs($admin)
        ->get('/admin/exports/attendance?format=csv&report_type=daily&date_from=2026-05-12&date_to=2026-05-12');

    $response
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    expect($response->getContent())
        ->toContain('Attendance Report')
        ->toContain('2026-05-12')
        ->toContain('Check-ins');

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $admin->id,
        'action' => 'admin.attendance_report_exported',
    ]);
});

it('exports attendance reports as pdf', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000103',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|export-pdf|2026000103|student@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => '2026-05-12 16:30:00',
    ]);

    $response = $this->actingAs($admin)
        ->get('/admin/exports/attendance?format=pdf&report_type=daily&date_from=2026-05-12&date_to=2026-05-12');

    $response
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf');

    expect($response->getContent())
        ->toStartWith('%PDF-1.4')
        ->toContain('ATTENDANCE REPORT');
});
