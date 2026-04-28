<?php

namespace App\Services\User;

use App\Repositories\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserRole;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
        ]);

        if (isset($data['student_ids']) && $data['role'] === UserRole::PARENT->value) {
            $this->userRepository->syncChildren($user->id, $data['student_ids']);
        }

        return $user;
    }

    public function updateUser(int $id, array $data): bool
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $updated = $this->userRepository->update($id, [
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ] + (isset($data['password']) ? ['password' => $data['password']] : []));

        if ($updated && isset($data['student_ids'])) {
            $user = $this->userRepository->getById($id);
            if ($user && $user->role === UserRole::PARENT) {
                $this->userRepository->syncChildren($user->id, $data['student_ids']);
            }
        }

        return $updated;
    }

    public function updateStatus(int $id, string $status): bool
    {
        return $this->userRepository->update($id, ['status' => $status]);
    }
}
