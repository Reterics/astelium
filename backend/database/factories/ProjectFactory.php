<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;
use App\Models\Client;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'account_id' => Account::inRandomOrder()->first()->id ?? Account::factory(), // Ensure account is set
            'client_id' => Client::factory(), // Links project to a client
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['active','completed','on-hold']), // Using statuses from KanbanBoard.tsx
        ];
    }
}
