<?php

namespace App\Services\System;

use App\Enums\AuditLogCategory;
use App\Enums\UserRole;
use App\Models\SystemSetting;
use App\Repositories\System\Contracts\SystemSettingRepositoryInterface;
use App\Services\Audit\AuditTrailService;
use Illuminate\Support\Collection;

class SystemSettingService
{
    public function __construct(
        protected SystemSettingRepositoryInterface $systemSettingRepository,
        protected AuditTrailService $auditTrailService
    ) {}

    public function getSettings(): SystemSetting
    {
        return $this->systemSettingRepository->firstOrCreate($this->defaultSettings());
    }

    public function updateSettings(array $data): SystemSetting
    {
        $settings = $this->getSettings();
        $payload = $this->preparePayload($data);

        $this->systemSettingRepository->update($settings, $payload);
        $settings->refresh();

        $this->auditTrailService->record(
            AuditLogCategory::ADMIN_ACTION,
            'admin.system_settings_updated',
            'Updated system settings.',
            $settings,
            [
                'school_name' => $settings->school_name,
                'school_email' => $settings->school_email,
                'sms_provider' => $settings->sms_provider,
                'mail_mailer' => $settings->mail_mailer,
                'roles_updated' => array_keys($settings->role_permissions ?? []),
                'sms_api_key_saved' => filled($settings->sms_api_key),
                'mail_password_saved' => filled($settings->mail_password),
            ]
        );

        return $settings;
    }

    public function getPermissionGroups(): Collection
    {
        return collect([
            [
                'key' => 'access',
                'label' => 'Access Management',
                'permissions' => [
                    ['key' => 'access.users', 'label' => 'User Management'],
                    ['key' => 'access.students', 'label' => 'Student Management'],
                    ['key' => 'access.parents', 'label' => 'Parent / Guardian'],
                ],
            ],
            [
                'key' => 'student_operations',
                'label' => 'Student Operations',
                'permissions' => [
                    ['key' => 'student_operations.class_sections', 'label' => 'Class / Section'],
                    ['key' => 'student_operations.schedules', 'label' => 'Schedule'],
                    ['key' => 'student_operations.attendance', 'label' => 'Attendance'],
                    ['key' => 'student_operations.qr_codes', 'label' => 'QR Code Management'],
                ],
            ],
            [
                'key' => 'communications',
                'label' => 'Communications',
                'permissions' => [
                    ['key' => 'communications.notifications', 'label' => 'Notification Settings'],
                    ['key' => 'communications.announcements', 'label' => 'Announcements'],
                ],
            ],
            [
                'key' => 'governance',
                'label' => 'Governance',
                'permissions' => [
                    ['key' => 'governance.reports', 'label' => 'Reports & Analytics'],
                    ['key' => 'governance.audit_trail', 'label' => 'Logs / Audit Trail'],
                    ['key' => 'governance.system_settings', 'label' => 'System Settings'],
                ],
            ],
        ]);
    }

    public function getRoleOptions(): Collection
    {
        return collect(UserRole::cases())->map(fn (UserRole $role): array => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);
    }

    public function defaultRolePermissions(): array
    {
        $allPermissions = $this->getPermissionGroups()
            ->flatMap(fn (array $group): array => $group['permissions'])
            ->pluck('key')
            ->values()
            ->all();

        return [
            UserRole::ADMIN->value => $allPermissions,
            UserRole::PARENT->value => ['communications.announcements'],
            UserRole::STUDENT->value => [],
        ];
    }

    protected function defaultSettings(): array
    {
        return [
            'school_name' => config('app.name', 'SASN'),
            'role_permissions' => $this->defaultRolePermissions(),
        ];
    }

    protected function preparePayload(array $data): array
    {
        $payload = $data;

        if (array_key_exists('role_permissions', $payload)) {
            $payload['role_permissions'] = $this->normalizeRolePermissions($payload['role_permissions'] ?? []);
        }

        if (blank($payload['sms_api_key'] ?? null)) {
            unset($payload['sms_api_key']);
        }

        if (blank($payload['mail_password'] ?? null)) {
            unset($payload['mail_password']);
        }

        return $payload;
    }

    protected function normalizeRolePermissions(array $rolePermissions): array
    {
        $allowedPermissions = $this->getPermissionGroups()
            ->flatMap(fn (array $group): array => $group['permissions'])
            ->pluck('key')
            ->all();

        return $this->getRoleOptions()
            ->mapWithKeys(function (array $role) use ($allowedPermissions, $rolePermissions): array {
                $permissions = collect($rolePermissions[$role['value']] ?? [])
                    ->intersect($allowedPermissions)
                    ->values()
                    ->all();

                return [$role['value'] => $permissions];
            })
            ->all();
    }
}
