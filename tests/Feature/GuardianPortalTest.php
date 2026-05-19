<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserStatus;
use App\Models\StudentAttendanceLog;
use App\Models\User;

it('allows parents to view a dashboard scoped to linked children', function (): void {
    $parent = User::factory()->parent()->create();
    $child = User::factory()->student()->create([
        'status' => UserStatus::APPROVED,
        'student_number' => '2026001001',
    ]);
    $otherChild = User::factory()->student()->create([
        'status' => UserStatus::APPROVED,
        'student_number' => '2026001002',
    ]);

    $parent->children()->attach($child->id);

    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|2026001001|child@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);
    StudentAttendanceLog::create([
        'user_id' => $otherChild->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|2026001002|other@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 5),
    ]);

    $this->actingAs($parent)
        ->get('/parent/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('parent/dashboard')
            ->has('children.data', 1)
            ->has('attendanceRecords.data', 1)
            ->where('attendanceRecords.data.0.student.id', $child->id)
            ->where('summary.total_logs', 1)
        );
});

it('filters parent dashboard attendance by a specific date', function (): void {
    $parent = User::factory()->parent()->create();
    $child = User::factory()->student()->create(['status' => UserStatus::APPROVED]);
    $today = now()->toDateString();

    $parent->children()->attach($child->id);

    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|today|child@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);
    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|old|child@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => now()->subDay()->setTime(17, 0),
    ]);

    $this->actingAs($parent)
        ->get("/parent/dashboard?date_from={$today}&date_to={$today}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('parent/dashboard')
            ->has('attendanceRecords.data', 1)
            ->where('attendanceRecords.data.0.event_type', AttendanceEventType::CHECK_IN->value)
            ->where('filters.date_from', $today)
            ->where('filters.date_to', $today)
        );
});

it('allows parents to view notification alerts scoped to linked children', function (): void {
    $parent = User::factory()->parent()->create([
        'guardian_phone' => '+639171234567',
        'notification_sms_enabled' => true,
        'notification_email_enabled' => true,
    ]);
    $child = User::factory()->student()->create(['status' => UserStatus::APPROVED]);
    $otherChild = User::factory()->student()->create(['status' => UserStatus::APPROVED]);

    $parent->children()->attach($child->id);

    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|notify|child@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => now()->setTime(17, 0),
    ]);
    StudentAttendanceLog::create([
        'user_id' => $otherChild->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|notify-other|other@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => now()->setTime(17, 5),
    ]);

    $this->actingAs($parent)
        ->get('/parent/notifications')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('parent/notifications')
            ->has('attendanceAlerts.data', 1)
            ->where('attendanceAlerts.data.0.student.id', $child->id)
            ->where('summary.total_alerts', 1)
            ->where('summary.sms_enabled', true)
            ->where('summary.email_enabled', true)
        );
});

it('prevents non-parents from opening parent portal pages', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->student()->create();

    $this->actingAs($admin)
        ->get('/parent/dashboard')
        ->assertForbidden();

    $this->actingAs($student)
        ->get('/parent/notifications')
        ->assertForbidden();
});
