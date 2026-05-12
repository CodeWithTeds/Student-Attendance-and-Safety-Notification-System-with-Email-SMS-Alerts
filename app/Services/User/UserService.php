<?php

namespace App\Services\User;

use App\Enums\AuditLogCategory;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Services\Audit\AuditTrailService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected StudentQrCodeService $studentQrCodeService,
        protected AuditTrailService $auditTrailService
    ) {}

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);

        $isStudent = $data['role'] === UserRole::STUDENT->value;
        $name = $this->resolveDisplayName($data);

        $user = $this->userRepository->create([
            'name' => $name,
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'status' => $isStudent ? UserStatus::PENDING->value : UserStatus::APPROVED->value,
            'student_id' => $isStudent ? (string) Str::uuid() : null,
            'student_number' => $isStudent ? $this->generateStudentNumber() : null,
            'first_name' => $data['first_name'] ?? null,
            'middle_name' => $data['middle_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'guardian_phone' => $data['guardian_phone'] ?? null,
            'notification_sms_enabled' => $data['notification_sms_enabled'] ?? false,
            'notification_email_enabled' => $data['notification_email_enabled'] ?? false,
        ]);

        if (isset($data['student_ids']) && $data['role'] === UserRole::PARENT->value) {
            $this->userRepository->syncChildren($user->id, $data['student_ids']);
        }

        if (isset($data['section_ids']) && $data['role'] === UserRole::STUDENT->value) {
            $this->userRepository->syncSections($user->id, $data['section_ids']);
        }

        $this->auditTrailService->record(
            AuditLogCategory::ADMIN_ACTION,
            'admin.user_created',
            "Created {$user->role->value} account for {$user->name}.",
            $user,
            [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role->value,
            ]
        );

        return $user;
    }

    public function updateUser(int $id, array $data): bool
    {
        $user = $this->userRepository->getById($id);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $name = $this->resolveDisplayName($data);

        $updateData = [
            'name' => $name,
            'email' => $data['email'],
            'role' => $data['role'],
            'first_name' => $data['first_name'] ?? null,
            'middle_name' => $data['middle_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'guardian_phone' => $data['guardian_phone'] ?? null,
            'notification_sms_enabled' => $data['notification_sms_enabled'] ?? false,
            'notification_email_enabled' => $data['notification_email_enabled'] ?? false,
        ];

        if (isset($data['student_number'])) {
            $updateData['student_number'] = $data['student_number'];
        }

        if (isset($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        $updated = $this->userRepository->update($id, $updateData);

        if ($updated && isset($data['student_ids'])) {
            $user = $this->userRepository->getById($id);
            if ($user && $user->role === UserRole::PARENT) {
                $this->userRepository->syncChildren($user->id, $data['student_ids']);
            }
        }

        if ($updated && isset($data['section_ids'])) {
            $user = $this->userRepository->getById($id);
            if ($user && $user->role === UserRole::STUDENT) {
                $this->userRepository->syncSections($user->id, $data['section_ids']);
            }
        }

        if ($updated && $user) {
            $this->auditTrailService->record(
                AuditLogCategory::ADMIN_ACTION,
                'admin.user_updated',
                "Updated account for {$user->name}.",
                $user,
                [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'changed_fields' => array_keys($updateData),
                ]
            );
        }

        return $updated;
    }

    public function updateStudent(int $id, array $data): bool
    {
        return $this->updateUser($id, $data);
    }

    public function updateStatus(int $id, string $status): bool
    {
        $updated = $this->userRepository->update($id, ['status' => $status]);
        $user = $this->userRepository->getById($id);

        if ($updated && $user) {
            $this->auditTrailService->record(
                AuditLogCategory::ADMIN_ACTION,
                'admin.user_status_updated',
                "Updated {$user->name}'s status to {$status}.",
                $user,
                [
                    'user_id' => $user->id,
                    'status' => $status,
                ]
            );
        }

        return $updated;
    }

    public function approveStudent(int $id): bool
    {
        $student = $this->userRepository->getById($id);

        if (! $student) {
            return false;
        }

        $studentId = $student->student_id ?: (string) Str::uuid();
        $studentNumber = $student->student_number ?: $this->generateStudentNumber();
        $payload = $student->qr_code_value ?: $this->studentQrCodeService->generatePayload($student, $studentId, $studentNumber);
        $svg = $student->qr_code_svg ?: $this->studentQrCodeService->generateSvg($payload);

        $updated = $this->userRepository->update($id, [
            'status' => UserStatus::APPROVED->value,
            'student_id' => $studentId,
            'student_number' => $studentNumber,
            'qr_code_value' => $payload,
            'qr_code_svg' => $svg,
        ]);

        if ($updated) {
            $this->auditTrailService->record(
                AuditLogCategory::ADMIN_ACTION,
                'admin.student_approved',
                "Approved student account for {$student->name}.",
                $student,
                [
                    'user_id' => $student->id,
                    'student_number' => $studentNumber,
                ]
            );
        }

        return $updated;
    }

    public function deleteUser(int $id): bool
    {
        $user = $this->userRepository->getById($id);
        $deleted = $this->userRepository->delete($id);

        if ($deleted && $user) {
            $this->auditTrailService->record(
                AuditLogCategory::ADMIN_ACTION,
                'admin.user_deleted',
                "Deleted account for {$user->name}.",
                null,
                [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            );
        }

        return $deleted;
    }

    protected function resolveDisplayName(array $data): string
    {
        $parts = array_filter([
            $data['first_name'] ?? null,
            $data['middle_name'] ?? null,
            $data['last_name'] ?? null,
        ]);

        if ($parts !== []) {
            return implode(' ', $parts);
        }

        return $data['name'];
    }

    protected function generateStudentNumber(): string
    {
        return now()->format('Y').random_int(100000, 999999);
    }
}
