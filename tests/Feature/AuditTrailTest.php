<?php

use App\Enums\AnnouncementAudienceType;
use App\Enums\AnnouncementDeliveryStatus;
use App\Enums\AnnouncementStatus;
use App\Enums\AttendanceEventType;
use App\Enums\AuditLogCategory;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Announcement;
use App\Models\AnnouncementRecipient;
use App\Models\AuditLog;
use App\Models\StudentAttendanceLog;
use App\Models\StudentAttendanceLogEdit;
use App\Models\User;

it('allows admins to view audit trail data sources', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
        'student_number' => '2026000044',
    ]);
    $guardian = User::factory()->create([
        'role' => UserRole::PARENT,
        'name' => 'Guardian Audit',
    ]);

    AuditLog::create([
        'actor_id' => $admin->id,
        'category' => AuditLogCategory::ADMIN_ACTION->value,
        'action' => 'admin.user_created',
        'description' => 'Created a test account.',
    ]);

    $attendanceLog = StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|audit|2026000044|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);

    StudentAttendanceLogEdit::create([
        'student_attendance_log_id' => $attendanceLog->id,
        'edited_by_id' => $admin->id,
        'old_event_type' => AttendanceEventType::CHECK_IN->value,
        'new_event_type' => AttendanceEventType::CHECK_OUT->value,
        'old_scanned_at' => now()->setTime(8, 0),
        'new_scanned_at' => now()->setTime(8, 15),
        'note' => 'Audit page seed.',
    ]);

    $announcement = Announcement::create([
        'created_by_id' => $admin->id,
        'title' => 'Audit announcement',
        'message' => 'Audit message',
        'sms_enabled' => true,
        'email_enabled' => true,
        'audience_type' => AnnouncementAudienceType::SELECTED_GUARDIANS->value,
        'status' => AnnouncementStatus::SENT->value,
        'sent_at' => now(),
    ]);

    AnnouncementRecipient::create([
        'announcement_id' => $announcement->id,
        'guardian_id' => $guardian->id,
        'sms_status' => AnnouncementDeliveryStatus::SENT->value,
        'email_status' => AnnouncementDeliveryStatus::SKIPPED->value,
        'sms_sent_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get('/admin/audit-trail')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/audit-trail/index')
            ->has('auditLogs.data', 1)
            ->has('attendanceChanges.data', 1)
            ->has('notificationHistory.data', 1)
            ->where('summary.admin_actions', 1)
            ->where('summary.attendance_changes', 1)
            ->where('summary.notification_events', 1)
        );
});

it('records attendance edits in the audit log', function (): void {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create([
        'role' => UserRole::STUDENT,
        'status' => UserStatus::APPROVED,
    ]);
    $attendanceLog = StudentAttendanceLog::create([
        'user_id' => $student->id,
        'qr_code_value' => 'SASN-STUDENT|audit-edit|2026000045|student@example.test',
        'event_type' => AttendanceEventType::CHECK_IN->value,
        'scanned_at' => now()->setTime(8, 0),
    ]);

    $this->actingAs($admin)
        ->put("/admin/attendance/{$attendanceLog->id}", [
            'event_type' => AttendanceEventType::CHECK_OUT->value,
            'scanned_at' => now()->setTime(8, 30)->format('Y-m-d H:i:s'),
            'note' => 'Corrected for audit trail.',
        ])
        ->assertRedirect(route('admin.attendance.index'));

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $admin->id,
        'category' => AuditLogCategory::ATTENDANCE_CHANGE->value,
        'action' => 'attendance.updated',
    ]);
});
