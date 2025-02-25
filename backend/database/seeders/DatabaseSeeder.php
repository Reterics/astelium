<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Account;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('securepassword'),
                'role' => 'admin',
            ]
        );

        $account = Account::updateOrCreate(
            ['name' => 'Default Company'], // Ensure the account exists
            [
                'admin_user_id' => $admin->id, // Now we can assign the admin ID
                'subscription_plan' => 'premium',
                'subscription_status' => 'active',
                'billing_cycle' => 'monthly',
                'trial_ends_at' => now()->addDays(14),
            ]
        );

        $admin->update(['account_id' => $account->id]);

        User::updateOrInsert(
            ['email' => 'member@example.com'],
            [
                'name' => 'Member User',
                'password' => Hash::make('securepassword'),
                'account_id' => $account->id,
                'role' => 'member',
            ]
        );

        $this->command->info('Database seeded successfully.');
    }
}
