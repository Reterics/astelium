<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\TransactionCategory;
use Illuminate\Database\Seeder;

class TransactionCategorySeeder extends Seeder
{
    /**
     * Seed the application's database with demo transaction categories.
     */
    public function run(): void
    {
        // Get the first account
        $account = Account::first();

        if (!$account) {
            $this->command->error("No account found! Run `php artisan db:seed` first.");
            return;
        }

        // Create demo categories
        $categories = [
            [
                'name' => 'Income',
                'color' => '#4CAF50', // Green
                'icon' => 'arrow_upward',
            ],
            [
                'name' => 'Food',
                'color' => '#FF9800', // Orange
                'icon' => 'restaurant',
            ],
            [
                'name' => 'Transportation',
                'color' => '#2196F3', // Blue
                'icon' => 'directions_car',
            ],
            [
                'name' => 'Housing',
                'color' => '#9C27B0', // Purple
                'icon' => 'home',
            ],
            [
                'name' => 'Entertainment',
                'color' => '#E91E63', // Pink
                'icon' => 'movie',
            ],
            [
                'name' => 'Utilities',
                'color' => '#607D8B', // Blue Grey
                'icon' => 'power',
            ],
            [
                'name' => 'Car Savings',
                'color' => '#795548', // Brown
                'icon' => 'savings',
            ],
            [
                'name' => 'Education',
                'color' => '#009688', // Teal
                'icon' => 'school',
            ],
        ];

        foreach ($categories as $category) {
            TransactionCategory::create([
                'name' => $category['name'],
                'color' => $category['color'],
                'icon' => $category['icon'],
                'account_id' => $account->id,
            ]);
        }

        $this->command->info('Transaction categories have been seeded successfully!');
    }
}
