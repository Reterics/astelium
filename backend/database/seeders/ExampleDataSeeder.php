<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\Warehouse;
use App\Models\Storage;
use App\Models\Domain;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class ExampleDataSeeder extends Seeder
{
    /**
     * Seed the application's database with example data.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Create Clients
            $clients = Client::factory(10)->create();

            // Create Projects for each Client
            $projects = collect();
            $clients->each(function ($client) use ($projects) {
                $projects->push(...Project::factory(rand(1, 5))->create([
                    'client_id' => $client->id,
                ]));
            });

            // Create Tasks
            Task::factory(50)->create([
                'project_id' => $projects->random()->id, // Ensure valid project_id
                'assigned_to' => null,
            ]);

            // Create Warehouses
            $warehouses = Warehouse::factory(5)->create();

            // Create Storages
            $storages = Storage::factory(10)->create();

            // Attach Storages to Warehouses via Pivot Table
            $warehouses->each(function ($warehouse) use ($storages) {
                $warehouse->storages()->attach(
                    $storages->random(rand(1, 5))->pluck('id')->toArray() // Randomly attach storages
                );
            });

            // Create Domains
            $domains = Domain::factory(10)->create();

            // Create Transactions linked to Clients and Domains
            $clients->each(function ($client) use ($domains) {
                Transaction::factory(50)->create();
            });
        });


        $this->command->info('Example data has been seeded!');
    }
}
