<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Mail\StudentAttendanceNotification;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\SectionSchedule;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

it('shows the public qr scanner page without authentication', function (): void {
    $this->get('/qr-scanner')->assertOk();
});

it('shows the student qr scanner page in the student sidebar area', function (): void {
    $student = User::factory()->student()->create([
        'status' => UserStatus::APPROVED,
    ]);

    $this->actingAs($student)
        ->get('/student/qr-scanner')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/qr-scanner')
        );
});

it('records check in then check out for an approved student qr scan', function (): void {
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000001',
        'qr_code_value' => 'SASN-STUDENT|test-student|2026000001|student@example.test',
    ]);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertCreated()
        ->assertJsonPath('data.event_type', AttendanceEventType::CHECK_IN->value)
        ->assertJsonPath('data.student.id', $student->id);

    $this->travel(2)->minutes();

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertCreated()
        ->assertJsonPath('data.event_type', AttendanceEventType::CHECK_OUT->value)
        ->assertJsonPath('data.student.id', $student->id);

    $this->assertDatabaseHas('student_attendance_logs', [
        'user_id' => $student->id,
        'event_type' => AttendanceEventType::CHECK_IN->value,
    ]);

    $this->assertDatabaseHas('student_attendance_logs', [
        'user_id' => $student->id,
        'event_type' => AttendanceEventType::CHECK_OUT->value,
    ]);
});

it('rejects additional scans after one time in and one time out for the day', function (): void {
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000005',
        'qr_code_value' => 'SASN-STUDENT|completed-day|2026000005|student@example.test',
    ]);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])->assertCreated();

    $this->travel(2)->minutes();

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])->assertCreated();

    $this->travel(2)->minutes();

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', "{$student->name} already completed Time In and Time Out today.");
});

it('prevents a second manual check in while the student is still timed in', function (): void {
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000002',
        'qr_code_value' => 'SASN-STUDENT|still-in|2026000002|student@example.test',
    ]);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
        'event_type' => AttendanceEventType::CHECK_IN->value,
    ])->assertCreated();

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
        'event_type' => AttendanceEventType::CHECK_IN->value,
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', "{$student->name} is still timed in. Scan Time Out before another Time In.");
});

it('prevents manual check out before a student has timed in', function (): void {
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000003',
        'qr_code_value' => 'SASN-STUDENT|not-in|2026000003|student@example.test',
    ]);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
        'event_type' => AttendanceEventType::CHECK_OUT->value,
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', "{$student->name} has no active Time In today. Scan Time In first.");
});

it('shows the assigned section schedule in attendance scan responses', function (): void {
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade 7',
        'code' => 'G7',
        'sort_order' => 7,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'A',
        'school_year' => '2026-2027',
        'capacity' => 40,
    ]);
    SectionSchedule::create([
        'section_id' => $section->id,
        'time_in' => '08:00:00',
        'time_out' => '16:00:00',
    ]);
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000006',
        'qr_code_value' => 'SASN-STUDENT|schedule|2026000006|student@example.test',
    ]);

    $student->sections()->attach($section->id);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertCreated()
        ->assertJsonPath('data.schedule.time_in_display', '08:00 AM')
        ->assertJsonPath('data.schedule.time_out_display', '04:00 PM');
});

it('queues parent email notifications for recorded attendance scans when enabled', function (): void {
    Mail::fake();

    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000004',
        'qr_code_value' => 'SASN-STUDENT|notify-parent|2026000004|student@example.test',
    ]);
    $guardian = User::factory()->parent()->create([
        'email' => 'guardian@example.test',
        'notification_email_enabled' => true,
    ]);

    $student->parents()->attach($guardian->id);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])->assertCreated();

    Mail::assertQueued(StudentAttendanceNotification::class, fn (StudentAttendanceNotification $mail): bool => $mail->attendanceLog->student->is($student));
});

it('rejects qr scans that are not assigned to approved students', function (): void {
    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => 'unknown-qr-code',
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', 'This QR code is not assigned to an approved student.');
});
