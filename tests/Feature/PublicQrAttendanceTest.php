<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Support\Str;

it('shows the public qr scanner page without authentication', function (): void {
    $this->get('/qr-scanner')->assertOk();
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

it('rejects qr scans that are not assigned to approved students', function (): void {
    $this->postJson('/api/v1/qr-scanner/attendance', [
        'qr_code_value' => 'unknown-qr-code',
    ])
        ->assertUnprocessable()
        ->assertJsonPath('data.qr_code_value.0', 'This QR code is not assigned to an approved student.');
});
