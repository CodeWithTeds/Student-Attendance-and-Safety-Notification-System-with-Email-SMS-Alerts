<?php

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;

it('allows admins to view system settings', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/system-settings')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/system-settings/index')
            ->where('settings.data.school_name', config('app.name', 'SASN'))
            ->has('roles', 3)
            ->has('permissionGroups', 4)
        );

    $this->assertDatabaseHas('system_settings', [
        'school_name' => config('app.name', 'SASN'),
    ]);
});

it('allows admins to update school, messaging, and permission settings', function (): void {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->put('/admin/system-settings', [
            'school_name' => 'SASN Learning Center',
            'school_id' => 'SASN-2026',
            'school_email' => 'office@sasn.test',
            'school_phone' => '09171234567',
            'school_address' => 'Main Campus, Manila',
            'sms_provider' => 'Semaphore',
            'sms_api_key' => 'sms-secret-key',
            'sms_sender_id' => 'SASN',
            'mail_mailer' => 'smtp',
            'mail_host' => 'smtp.mail.test',
            'mail_port' => 587,
            'mail_username' => 'mailer@sasn.test',
            'mail_password' => 'mail-secret-password',
            'mail_encryption' => 'tls',
            'mail_from_address' => 'noreply@sasn.test',
            'mail_from_name' => 'SASN Office',
            'role_permissions' => [
                'admin' => ['access.users', 'governance.system_settings'],
                'parent' => ['communications.announcements'],
                'student' => [],
            ],
        ])
        ->assertRedirect(route('admin.system-settings.index'));

    $settings = SystemSetting::firstOrFail();

    expect($settings->school_name)->toBe('SASN Learning Center')
        ->and($settings->sms_api_key)->toBe('sms-secret-key')
        ->and($settings->mail_password)->toBe('mail-secret-password')
        ->and($settings->role_permissions['admin'])->toBe(['access.users', 'governance.system_settings']);

    $raw = DB::table('system_settings')->first();

    expect($raw->sms_api_key)->not->toBe('sms-secret-key')
        ->and($raw->mail_password)->not->toBe('mail-secret-password');

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $admin->id,
        'action' => 'admin.system_settings_updated',
    ]);
});
