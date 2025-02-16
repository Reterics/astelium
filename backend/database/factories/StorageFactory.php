<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Storage;

class StorageFactory extends Factory
{
    protected $model = Storage::class;

    public function definition()
    {
        return [
            'sku' => strtoupper($this->faker->bothify('???-#####')),
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'threshold' => $this->faker->numberBetween(10, 500),
            'storage_amount' => $this->faker->numberBetween(1, 1000),
            'value' => $this->faker->randomFloat(2, 5, 5000),
        ];
    }
}
