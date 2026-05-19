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

function publicQrCreateScheduledStudent(array $attributes = [], ?string $timeIn = null, ?string $timeOut = null): User
{
    $gradeLevel = GradeLevel::create([
        'name' => 'Grade '.Str::upper(Str::random(4)),
        'code' => 'G'.Str::upper(Str::random(5)),
        'sort_order' => 7,
    ]);
    $section = Section::create([
        'grade_level_id' => $gradeLevel->id,
        'name' => 'Section '.Str::upper(Str::random(4)),
        'school_year' => '2026-2027',
        'capacity' => 40,
    ]);

    SectionSchedule::create([
        'section_id' => $section->id,
        'time_in' => $timeIn ?? now()->copy()->subMinutes(10)->format('H:i:s'),
        'time_out' => $timeOut ?? now()->copy()->subMinute()->format('H:i:s'),
    ]);

    $student = User::factory()->create(array_merge([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => (string) random_int(2026000000, 2026999999),
        'qr_code_value' => 'SASN-STUDENT|'.Str::uuid(),
    ], $attributes));

    $student->sections()->attach($section->id);

    return $student;
}

it('shows the public qr scanner page without authentication', function (): void {
    $this->get('/qr-scanner')->assertOk();
});

it('shows the student qr scanner page in the student sidebar area', function (): void {
    $student = publicQrCreateScheduledStudent([
        'name' => 'Student With Schedule',
    ], '08:00:00', '16:00:00');

    $this->actingAs($student)
        ->get('/student/qr-scanner')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/qr-scanner')
            ->where('studentSection.schedule.time_in_display', '08:00 AM')
            ->where('studentSection.schedule.time_out_display', '04:00 PM')
        );
});

it('records check in then check out for an approved student qr scan', function (): void {
    $student = publicQrCreateScheduledStudent([
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
    $student = publicQrCreateScheduledStudent([
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
    $student = publicQrCreateScheduledStudent([
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
    $student = publicQrCreateScheduledStudent([
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

it('prevents time in earlier than one hour before the section schedule', function (): void {
    $student = publicQrCreateScheduledStudent([
        'student_number' => '2026000007',
        'qr_code_value' => 'SASN-STUDENT|too-early|2026000007|student@example.test',
    ], '08:00:00', '16:00:00');

    $this->travelTo(now()->setTime(6, 59));

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', "{$student->name} can only Time In within 1 hour before the scheduled Time In at 08:00 AM.");
});

it('prevents attendance scans when the student has no assigned section schedule', function (): void {
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_id' => (string) Str::uuid(),
        'student_number' => '2026000010',
        'qr_code_value' => 'SASN-STUDENT|no-schedule|2026000010|student@example.test',
    ]);

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', "{$student->name} has no section schedule assigned. Please contact the registrar before scanning attendance.");
});

it('marks time in as late more than twenty minutes after the section schedule', function (): void {
    $student = publicQrCreateScheduledStudent([
        'student_number' => '2026000008',
        'qr_code_value' => 'SASN-STUDENT|late|2026000008|student@example.test',
    ], '08:00:00', '16:00:00');

    $this->travelTo(now()->setTime(8, 21));

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertCreated()
        ->assertJsonPath('data.event_type', AttendanceEventType::CHECK_IN->value)
        ->assertJsonPath('data.schedule_status', 'Late');
});

it('prevents time out before the scheduled section time out', function (): void {
    $student = publicQrCreateScheduledStudent([
        'student_number' => '2026000009',
        'qr_code_value' => 'SASN-STUDENT|early-time-out|2026000009|student@example.test',
    ], '08:00:00', '16:00:00');

    $this->travelTo(now()->setTime(7, 30));

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
        'event_type' => AttendanceEventType::CHECK_IN->value,
    ])->assertCreated();

    $this->travelTo(now()->setTime(15, 59));

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
        'event_type' => AttendanceEventType::CHECK_OUT->value,
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', "{$student->name} can only Time Out at or after the scheduled Time Out at 04:00 PM.");
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

    $this->travelTo(now()->setTime(8, 0));

    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => $student->qr_code_value,
    ])
        ->assertCreated()
        ->assertJsonPath('data.schedule.time_in_display', '08:00 AM')
        ->assertJsonPath('data.schedule.time_out_display', '04:00 PM');
});

it('queues parent email notifications for recorded attendance scans when enabled', function (): void {
    Mail::fake();

    $student = publicQrCreateScheduledStudent([
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
