<?php

use App\Enums\AnnouncementAudienceType;
use App\Enums\AnnouncementDeliveryStatus;
use App\Enums\UserRole;
use App\Mail\SchoolAnnouncementMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

it('allows admins to view announcement management', function (): void {
    $admin = User::factory()->admin()->create();
    $guardian = User::factory()->create([
        'role' => UserRole::PARENT,
        'name' => 'Guardian One',
        'notification_email_enabled' => true,
    ]);

    $this->actingAs($admin)
        ->get('/admin/announcements')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/announcements/index')
            ->has('guardians.data', 1)
            ->where('guardians.data.0.id', $guardian->id)
        );
});

it('sends an email and sms announcement to selected guardians', function (): void {
    Mail::fake();

    $admin = User::factory()->admin()->create();
    $guardian = User::factory()->create([
        'role' => UserRole::PARENT,
        'name' => 'Guardian Two',
        'guardian_phone' => '09171234567',
        'notification_sms_enabled' => true,
        'notification_email_enabled' => true,
    ]);

    $this->actingAs($admin)
        ->post('/admin/announcements', [
            'title' => 'Class suspension',
            'message' => 'Classes are suspended today due to heavy rain.',
            'sms_enabled' => true,
            'email_enabled' => true,
            'audience_type' => AnnouncementAudienceType::SELECTED_GUARDIANS->value,
            'guardian_ids' => [$guardian->id],
        ])
        ->assertRedirect(route('admin.announcements.index'));

    $this->assertDatabaseHas('announcements', [
        'title' => 'Class suspension',
        'sms_enabled' => true,
        'email_enabled' => true,
    ]);

    $this->assertDatabaseHas('announcement_recipients', [
        'guardian_id' => $guardian->id,
        'sms_status' => AnnouncementDeliveryStatus::SENT->value,
        'email_status' => AnnouncementDeliveryStatus::SENT->value,
    ]);

    Mail::assertSent(SchoolAnnouncementMail::class, fn (SchoolAnnouncementMail $mail) => $mail->guardian->is($guardian));
});

it('skips announcement channels disabled on the guardian profile', function (): void {
    Mail::fake();

    $admin = User::factory()->admin()->create();
    $guardian = User::factory()->create([
        'role' => UserRole::PARENT,
        'guardian_phone' => null,
        'notification_sms_enabled' => false,
        'notification_email_enabled' => false,
    ]);

    $this->actingAs($admin)
        ->post('/admin/announcements', [
            'title' => 'Reminder',
            'message' => 'Please attend the meeting.',
            'sms_enabled' => true,
            'email_enabled' => true,
            'audience_type' => AnnouncementAudienceType::SELECTED_GUARDIANS->value,
            'guardian_ids' => [$guardian->id],
        ])
        ->assertRedirect(route('admin.announcements.index'));

    $this->assertDatabaseHas('announcement_recipients', [
        'guardian_id' => $guardian->id,
        'sms_status' => AnnouncementDeliveryStatus::SKIPPED->value,
        'email_status' => AnnouncementDeliveryStatus::SKIPPED->value,
    ]);

    Mail::assertNothingSent();
});
