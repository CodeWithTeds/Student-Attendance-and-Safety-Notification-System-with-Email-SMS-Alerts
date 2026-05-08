<?php

use App\Enums\NotificationEventType;
use App\Models\NotificationSetting;
use App\Models\User;

it('allows admins to view notification management settings', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/notifications')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/notifications/index')
            ->has('notificationSettings.data', 4)
            ->where('notificationSettings.data.0.event_type', NotificationEventType::ATTENDANCE->value)
        );

    $this->assertDatabaseHas('notification_settings', [
        'event_type' => NotificationEventType::ABSENCE->value,
        'title' => NotificationEventType::ABSENCE->defaultTitle(),
    ]);
});

it('allows admins to update notification channels and message copy', function (): void {
    $admin = User::factory()->admin()->create();
    $setting = NotificationSetting::create([
        'event_type' => NotificationEventType::LATE->value,
        'sms_enabled' => false,
        'email_enabled' => true,
        'title' => 'Late arrival alert',
        'message_template' => 'Old message',
    ]);

    $this->actingAs($admin)
        ->put("/admin/notifications/{$setting->id}", [
            'sms_enabled' => true,
            'email_enabled' => false,
            'title' => 'Late notice',
            'message_template' => '{student_name} arrived at {event_time}.',
        ])
        ->assertRedirect(route('admin.notifications.index'));

    $this->assertDatabaseHas('notification_settings', [
        'id' => $setting->id,
        'sms_enabled' => true,
        'email_enabled' => false,
        'title' => 'Late notice',
        'message_template' => '{student_name} arrived at {event_time}.',
    ]);
});
