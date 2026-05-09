<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'grade_level_id' => ['required', 'exists:grade_levels,id'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'gender' => ['required', 'string', 'in:Male,Female,Other'],
            'date_of_birth' => ['required', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'nationality' => ['required', 'string', 'max:100'],
            'house_no' => ['nullable', 'string', 'max:100'],
            'street' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'zip_code' => ['required', 'string', 'max:10'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
        ])->validate();

        // Build the full name from parts
        $nameParts = [$input['first_name']];
        if (!empty($input['middle_name'])) {
            $nameParts[] = $input['middle_name'];
        }
        $nameParts[] = $input['last_name'];
        if (!empty($input['suffix'])) {
            $nameParts[] = $input['suffix'];
        }

        return User::create([
            'name' => implode(' ', $nameParts),
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => 'student',
            'status' => 'pending',
            'student_id' => $input['student_id'] ?? (string) Str::uuid(),
            'student_number' => $input['student_number'] ?? '2580' . random_int(1000, 9999),
            'grade_level_id' => $input['grade_level_id'],
            'first_name' => $input['first_name'],
            'middle_name' => $input['middle_name'] ?? null,
            'last_name' => $input['last_name'],
            'suffix' => $input['suffix'] ?? null,
            'gender' => $input['gender'],
            'date_of_birth' => $input['date_of_birth'],
            'place_of_birth' => $input['place_of_birth'] ?? null,
            'nationality' => $input['nationality'] ?? 'Filipino',
            'house_no' => $input['house_no'] ?? null,
            'street' => $input['street'],
            'barangay' => $input['barangay'],
            'city' => $input['city'],
            'province' => $input['province'],
            'zip_code' => $input['zip_code'],
        ]);
    }
}
