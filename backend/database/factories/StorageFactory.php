<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Storage;

class StorageFactory extends Factory
{
    protected $model = Storage::class;

    public function definition()
    {
        return [
            'account_id' => Account::inRandomOrder()->first()->id ?? Account::factory(), // Ensure account is set
            'sku' => strtoupper($this->faker->bothify('???-#####')),
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'threshold' => $this->faker->numberBetween(10, 500),
            'storage_amount' => $this->faker->numberBetween(1, 1000),
            'value' => $this->faker->randomFloat(2, 5, 5000),
        ];
    }
}
