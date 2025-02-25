<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Domain;

class DomainFactory extends Factory
{
    protected $model = Domain::class;

    public function definition()
    {
        return [
            'account_id' => Account::inRandomOrder()->first()->id ?? Account::factory(), // Ensure account is set
            'url' => $this->faker->url, // ✅ Correct field
            'description' => $this->faker->sentence,
            'admin_url' => $this->faker->url, // Assuming admin panel URL
            'credentials' => $this->faker->sentence, // Example placeholder data
        ];
    }
}
