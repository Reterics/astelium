<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Transaction;
use App\Models\Client;
use App\Models\Project;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition()
    {
        return [
            'type' => $this->faker->randomElement(['income', 'outgoing']), // ✅ Matches validation rules
            'amount' => $this->faker->randomFloat(2, 10, 5000),
            'date' => $this->faker->dateTime, // ✅ Matches controller field
            'description' => $this->faker->sentence,
            'related_project_id' => Project::factory(), // ✅ Matches controller field
            'related_client_id' => Client::factory(), // ✅ Matches controller field
        ];
    }
}
