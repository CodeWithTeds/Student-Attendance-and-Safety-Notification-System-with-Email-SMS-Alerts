<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ParentSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding 500 parent users...');

        // Hash password ONCE — reused for all 500 rows (huge performance gain)
        $hashedPassword = Hash::make('password');
        $now = now();

        $usedEmails = [];
        $parents = [];

        $bar = $this->command->getOutput()->createProgressBar(500);
        $bar->start();

        for ($i = 1; $i <= 200; $i++) {
            // Random 11-digit PH number: 09 + 9 random digits
            $phone = '09' . str_pad(random_int(0, 999999999), 9, '0', STR_PAD_LEFT);

            // Unique random email
            do {
                $email = Str::random(8) . random_int(1, 9999) . '@' . fake()->safeEmailDomain();
            } while (in_array($email, $usedEmails));
            $usedEmails[] = $email;

            $firstName = fake()->firstName();
            $lastName  = fake()->lastName();

            $parents[] = [
                'name'                       => $firstName . ' ' . $lastName,
                'first_name'                 => $firstName,
                'middle_name'                => fake()->lastName(),
                'last_name'                  => $lastName,
                'email'                      => $email,
                'email_verified_at'          => $now,
                'password'                   => $hashedPassword,
                'role'                       => UserRole::PARENT->value,
                'status'                     => UserStatus::APPROVED->value,
                'guardian_phone'             => $phone,
                'gender'                     => fake()->randomElement(['Male', 'Female']),
                'nationality'                => 'Filipino',
                'notification_sms_enabled'   => true,
                'notification_email_enabled' => true,
                'remember_token'             => Str::random(10),
                'created_at'                 => $now,
                'updated_at'                 => $now,
            ];

            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine();

        // Bulk insert in chunks of 100
        foreach (array_chunk($parents, 100) as $chunk) {
            DB::table('users')->insert($chunk);
        }

        $this->command->info('500 parent users seeded successfully.');
    }
}
