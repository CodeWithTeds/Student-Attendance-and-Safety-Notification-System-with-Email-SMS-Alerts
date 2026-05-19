<?php

use App\Enums\AttendanceEventType;
use App\Enums\UserStatus;
use App\Models\Announcement;
use App\Models\AnnouncementRecipient;
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

it('filters parent notification attendance alerts by event type and date', function (): void {
    $parent = User::factory()->parent()->create([
        'notification_sms_enabled' => true,
        'notification_email_enabled' => true,
    ]);
    $child = User::factory()->student()->create(['status' => UserStatus::APPROVED]);
    $today = now()->toDateString();

    $parent->children()->attach($child->id);

    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|notify-filter-in|child@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);
    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|notify-filter-out|child@example.test',
        'event_type' => AttendanceEventType::CHECK_OUT->value,
        'scanned_at' => now()->setTime(17, 0),
    ]);
    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|notify-filter-old|child@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->subDay()->setTime(8, 0),
    ]);

    $this->actingAs($parent)
        ->get("/parent/notifications?event_type=check_in&date_from={$today}&date_to={$today}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('parent/notifications')
            ->has('attendanceAlerts.data', 1)
            ->where('attendanceAlerts.data.0.event_type', AttendanceEventType::CHECK_IN->value)
            ->where('filters.event_type', AttendanceEventType::CHECK_IN->value)
            ->where('filters.date_from', $today)
            ->where('filters.date_to', $today)
        );
});

it('allows parents to monitor daily and monthly attendance records', function (): void {
    $parent = User::factory()->parent()->create();
    $child = User::factory()->student()->create(['status' => UserStatus::APPROVED]);

    $parent->children()->attach($child->id);

    StudentAttendanceLog::create([
        'user_id' => $child->id,
        'qr_code_value' => 'SASN-STUDENT|guardian|monitor|child@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);

    $month = now()->format('Y-m');

    $this->actingAs($parent)
        ->get("/parent/attendance-monitoring?period=monthly&month={$month}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('parent/attendance-monitoring')
            ->has('attendanceRecords.data', 1)
            ->where('filters.period', 'monthly')
            ->where('filters.month', $month)
            ->where('summary.total_logs', 1)
        );
});

it('allows parents to view school announcement alerts', function (): void {
    $admin = User::factory()->admin()->create();
    $parent = User::factory()->parent()->create();
    $announcement = Announcement::create([
        'created_by_id' => $admin->id,
        'title' => 'Class suspension',
        'message' => 'School alert message',
        'sms_enabled' => true,
        'email_enabled' => true,
        'audience_type' => 'all_guardians',
        'status' => 'sent',
        'sent_at' => now(),
    ]);

    AnnouncementRecipient::create([
        'announcement_id' => $announcement->id,
        'guardian_id' => $parent->id,
        'sms_status' => 'sent',
        'email_status' => 'sent',
        'sms_sent_at' => now(),
        'email_sent_at' => now(),
    ]);

    $this->actingAs($parent)
        ->get('/parent/announcements?notification_search=Class')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('parent/announcements')
            ->has('announcementNotifications.data', 1)
            ->where('announcementNotifications.data.0.announcement.title', 'Class suspension')
            ->where('filters.notification_search', 'Class')
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

    $this->actingAs($admin)
        ->get('/parent/attendance-monitoring')
        ->assertForbidden();

    $this->actingAs($student)
        ->get('/parent/announcements')
        ->assertForbidden();
});
