<?php

namespace App\Repositories\User\Contracts;

use Illuminate\Support\Collection;
use App\Models\User;

interface UserRepositoryInterface
{
    public function getAll(): Collection;
    public function getPaginated(int $perPage = 15);
    public function getById(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function syncChildren(int $parentId, array $studentIds): void;
    public function getStudents(): Collection;
}
