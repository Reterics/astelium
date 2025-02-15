<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrInsert(
            ['email' => 'admin@example.com'], // Check if this email exists
            [
                'name' => 'Admin User',
                'password' => Hash::make('securepassword'),
                'is_admin' => true,
            ]
        );
    }
}
