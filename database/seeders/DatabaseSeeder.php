<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@sasn.com',
            'password' => bcrypt('password'),
        ]);

        User::factory()->parent()->create([
            'name' => 'Parent User',
            'email' => 'parent@sasn.com',
            'password' => bcrypt('password'),
        ]);

        User::factory()->student()->create([
            'name' => 'Student User',
            'email' => 'student@sasn.com',
            'password' => bcrypt('password'),
        ]);
    }
}
