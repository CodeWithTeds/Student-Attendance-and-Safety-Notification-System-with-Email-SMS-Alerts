<?php

namespace App\Repositories\User\Eloquent;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function getAll(): Collection
    {
        return User::all();
    }

    public function getPaginated(int $perPage = 15)
    {
        return User::with('children')->paginate($perPage);
    }

    public function getById(int $id): ?User
    {
        return User::with('children')->find($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $user = User::find($id);
        if (! $user) {
            return false;
        }

        return $user->update($data);
    }

    public function delete(int $id): bool
    {
        $user = User::find($id);
        if (! $user) {
            return false;
        }

        return $user->delete();
    }

    public function syncChildren(int $parentId, array $studentIds): void
    {
        $parent = User::find($parentId);
        if ($parent) {
            $parent->children()->sync($studentIds);
        }
    }

    public function syncSections(int $studentId, array $sectionIds): void
    {
        $student = User::find($studentId);
        if ($student) {
            $student->sections()->sync($sectionIds);
        }
    }

    public function getStudents(): Collection
    {
        return User::where('role', UserRole::STUDENT->value)->get();
    }

    public function getStudentsPaginated(int $perPage = 15)
    {
        return User::with(['sections.gradeLevel', 'sections.schedule'])
            ->where('role', UserRole::STUDENT->value)
            ->latest()
            ->paginate($perPage);
    }

    public function getQrCodeStudentsPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('sections.gradeLevel')
            ->where('role', UserRole::STUDENT->value)
            ->where('status', UserStatus::APPROVED->value)
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query
                    ->where(function ($searchQuery) use ($search): void {
                        $searchQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('student_number', 'like', "%{$search}%");
                    });
            })
            ->when(($filters['qr_status'] ?? null) === 'generated', fn ($query) => $query->whereNotNull('qr_code_value'))
            ->when(($filters['qr_status'] ?? null) === 'missing', fn ($query) => $query->whereNull('qr_code_value'))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getParentsPaginated(int $perPage = 15)
    {
        return User::with('children')->where('role', UserRole::PARENT->value)->paginate($perPage);
    }

    public function getParentsForAnnouncement(?array $guardianIds = null): Collection
    {
        return User::query()
            ->with('children')
            ->where('role', UserRole::PARENT->value)
            ->when($guardianIds !== null, fn ($query) => $query->whereIn('id', $guardianIds))
            ->orderBy('name')
            ->get();
    }

    public function findApprovedStudentByQrCode(string $qrCodeValue): ?User
    {
        return User::with('parents')
            ->where('role', UserRole::STUDENT->value)
            ->where('status', UserStatus::APPROVED->value)
            ->where('qr_code_value', $qrCodeValue)
            ->first();
    }
}
