<?php

namespace App\Services\Student;

use App\Models\User;
use App\Repositories\User\Contracts\UserRepositoryInterface;
use Illuminate\Validation\ValidationException;

class StudentProfileService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getProfile(User $student): User
    {
        $profile = $this->userRepository->getStudentProfile($student->id);

        if (! $profile) {
            throw ValidationException::withMessages([
                'student' => 'Student profile could not be found.',
            ]);
        }

        return $profile;
    }
}
