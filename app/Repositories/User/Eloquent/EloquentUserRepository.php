<?php

namespace App\Repositories\User\Eloquent;

use App\Models\User;
use App\Enums\UserRole;
use App\Repositories\User\Contracts\UserRepositoryInterface;
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
        if (!$user) return false;
        
        return $user->update($data);
    }

    public function delete(int $id): bool
    {
        $user = User::find($id);
        if (!$user) return false;

        return $user->delete();
    }

    public function syncChildren(int $parentId, array $studentIds): void
    {
        $parent = User::find($parentId);
        if ($parent) {
            $parent->children()->sync($studentIds);
        }
    }

    public function getStudents(): Collection
    {
        return User::where('role', UserRole::STUDENT->value)->get();
    }

    public function getStudentsPaginated(int $perPage = 15)
    {
        return User::where('role', UserRole::STUDENT->value)->paginate($perPage);
    }
}
