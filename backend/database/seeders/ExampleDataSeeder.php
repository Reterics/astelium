<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\Warehouse;
use App\Models\Storage;
use App\Models\Domain;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExampleDataSeeder extends Seeder
{
    /**
     * Seed the application's database with example data.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Get the first account
            $account = Account::first();

            if (!$account) {
                $this->command->error("No account found! Run `php artisan db:seed` first.");
                return;
            }

            // ✅ Explicitly pass `account_id` when creating Clients
            $clients = Client::factory(10)->make()->each(function ($client) use ($account) {
                $client->account_id = $account->id;
                $client->save();
            });

            // ✅ Ensure `account_id` is set for Projects
            $projects = collect();
            $clients->each(function ($client) use ($projects, $account) {
                $projects->push(...Project::factory(rand(1, 5))->create([
                    'client_id' => $client->id,
                    'account_id' => $account->id,
                ]));
            });

            if ($projects->isEmpty()) {
                $this->command->warn("No projects were created, skipping task creation.");
            } else {
                // ✅ Ensure `account_id` is set for Tasks
                Task::factory(50)->create([
                    'project_id' => $projects->random()->id,
                    'account_id' => $account->id,
                    'assigned_to' => null,
                ]);
            }

            // ✅ Ensure `account_id` is set for Warehouses
            $warehouses = Warehouse::factory(5)->create([
                'account_id' => $account->id,
            ]);

            // ✅ Ensure `account_id` is set for Storages
            $storages = Storage::factory(10)->create([
                'account_id' => $account->id,
            ]);

            // Attach Storages to Warehouses via Pivot Table
            $warehouses->each(function ($warehouse) use ($storages) {
                $warehouse->storages()->attach(
                    $storages->random(rand(1, 5))->pluck('id')->toArray()
                );
            });

            // ✅ Ensure `account_id` is set for Domains
            $domains = Domain::factory(10)->create([
                'account_id' => $account->id,
            ]);

            // ✅ Ensure `account_id` is set for Transactions
            $clients->each(function ($client) use ($domains, $account) {
                Transaction::factory(50)->create([
                    'account_id' => $account->id,
                ]);
            });
        });

        $this->command->info('Example data has been seeded successfully!');
    }
}
