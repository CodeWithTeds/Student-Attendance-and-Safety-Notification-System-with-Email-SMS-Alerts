<?php

namespace App\Repositories\User\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function getAll(): Collection;

    public function getPaginated(int $perPage = 15);

    public function getById(int $id): ?User;

    public function create(array $data): User;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function syncChildren(int $parentId, array $studentIds): void;

    public function syncSections(int $studentId, array $sectionIds): void;

    public function getStudents(): Collection;

    public function getStudentsPaginated(int $perPage = 15);

    public function getQrCodeStudentsPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getStudentWithSchedule(int $id): ?User;

    public function getParentsPaginated(int $perPage = 15);

    public function getParentsForAnnouncement(?array $guardianIds = null): Collection;

    public function findApprovedStudentByQrCode(string $qrCodeValue): ?User;
}
