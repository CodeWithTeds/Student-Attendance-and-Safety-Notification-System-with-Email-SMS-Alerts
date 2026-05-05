<?php

namespace App\Services\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentQrManagementService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected StudentQrCodeService $studentQrCodeService
    ) {}

    public function getPaginatedStudents(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->getQrCodeStudentsPaginated($filters, $perPage);
    }

    public function generateQrCode(int $studentId): bool
    {
        $student = $this->resolveApprovedStudent($studentId);

        if ($student->qr_code_value && $student->qr_code_svg) {
            return true;
        }

        return $this->storeQrCode($student);
    }

    public function resetQrCode(int $studentId): bool
    {
        return $this->storeQrCode($this->resolveApprovedStudent($studentId));
    }

    protected function resolveApprovedStudent(int $studentId): User
    {
        $student = $this->userRepository->getById($studentId);

        if (! $student || $student->role !== UserRole::STUDENT || $student->status !== UserStatus::APPROVED) {
            throw ValidationException::withMessages([
                'student' => 'Only approved student records can be managed for QR codes.',
            ]);
        }

        return $student;
    }

    protected function storeQrCode(User $student): bool
    {
        $studentId = $student->student_id ?: (string) Str::uuid();
        $studentNumber = $student->student_number ?: $this->generateStudentNumber();
        $payload = $this->studentQrCodeService->generatePayload($student, $studentId, $studentNumber);

        return $this->userRepository->update($student->id, [
            'student_id' => $studentId,
            'student_number' => $studentNumber,
            'qr_code_value' => $payload,
            'qr_code_svg' => $this->studentQrCodeService->generateSvg($payload),
        ]);
    }

    protected function generateStudentNumber(): string
    {
        return now()->format('Y').random_int(100000, 999999);
    }
}
