<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Goal;
use App\Models\TransactionCategory;
use Illuminate\Database\Seeder;

class GoalSeeder extends Seeder
{
    /**
     * Seed the application's database with a demo goal linked to categories.
     */
    public function run(): void
    {
        // Get the first account
        $account = Account::first();

        if (!$account) {
            $this->command->error("No account found! Run `php artisan db:seed` first.");
            return;
        }

        // Get some categories to link to the goal
        $savingsCategory = TransactionCategory::where('name', 'Car Savings')->first();
        $incomeCategory = TransactionCategory::where('name', 'Income')->first();

        if (!$savingsCategory || !$incomeCategory) {
            $this->command->error("Required categories not found! Run the TransactionCategorySeeder first.");
            return;
        }

        // Create a demo goal
        $goal = Goal::create([
            'title' => 'New Car Fund',
            'target_amount' => 15000.00,
            'start_date' => now(),
            'due_date' => now()->addYear(),
            'account_id' => $account->id,
            'status' => 'active',
        ]);

        // Link categories to the goal
        $goal->transactionCategories()->attach([$savingsCategory->id, $incomeCategory->id]);

        $this->command->info('Demo goal has been seeded successfully!');
    }
}
