<?php

namespace Database\Factories;

use App\Models\Account;
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
            'account_id' => Account::inRandomOrder()->first()->id ?? Account::factory(), // Ensure account is set
            'type' => $this->faker->randomElement(['income', 'outgoing']), // ✅ Matches validation rules
            'amount' => $this->faker->randomFloat(2, 10, 5000),
            'date' => $this->faker->dateTime, // ✅ Matches controller field
            'description' => $this->faker->sentence,
            'related_project_id' => Project::factory(), // ✅ Matches controller field
            'related_client_id' => Client::factory(), // ✅ Matches controller field
        ];
    }
}
