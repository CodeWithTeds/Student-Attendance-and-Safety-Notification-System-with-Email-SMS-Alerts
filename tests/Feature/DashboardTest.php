<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\StudentAttendanceLog;
use App\Models\User;
use Illuminate\Support\Carbon;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('parent users are redirected from the shared dashboard to their dashboard', function () {
    $parent = User::factory()->parent()->create();

    $this->actingAs($parent)
        ->get(route('dashboard'))
        ->assertRedirect(route('parent.dashboard', absolute: false));
});

test('student dashboard includes filterable attendance summary', function (): void {
    Carbon::setTestNow('2026-05-19 10:00:00');

    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000199',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|dashboard-in|2026000199|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => '2026-05-19 07:30:00',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|dashboard-out|2026000199|student@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => '2026-05-19 16:10:00',
    ]);

    $this->actingAs($student)
        ->get('/dashboard?attendance_period=day&attendance_date=2026-05-19')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('stats.student_attendance_summary.selected_period', 'day')
            ->where('stats.student_attendance_summary.selected_date', '2026-05-19')
            ->where('stats.student_attendance_summary.totals.check_ins', 1)
            ->where('stats.student_attendance_summary.totals.check_outs', 1)
            ->has('stats.student_attendance_summary.chart', 8)
            ->has('stats.student_attendance_summary.options', 3)
        );

    Carbon::setTestNow();
});

test('student dashboard can show attendance for a specific selected date', function (): void {
    Carbon::setTestNow('2026-05-19 10:00:00');

    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000200',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|specific-date|2026000200|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => '2026-05-12 08:00:00',
    ]);

    StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|today|2026000200|student@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => '2026-05-19 16:30:00',
    ]);

    $this->actingAs($student)
        ->get('/dashboard?attendance_period=day&attendance_date=2026-05-12')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('stats.student_attendance_summary.selected_date', '2026-05-12')
            ->where('stats.student_attendance_summary.range_label', 'May 12, 2026')
            ->where('stats.student_attendance_summary.totals.check_ins', 1)
            ->where('stats.student_attendance_summary.totals.check_outs', 0)
            ->where('stats.student_attendance_summary.recent_logs.0.date', 'May 12, 2026')
        );

    Carbon::setTestNow();
});
