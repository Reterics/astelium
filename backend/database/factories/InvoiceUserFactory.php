<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\InvoiceUser;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceUser>
 */
class InvoiceUserFactory extends Factory
{
    protected $model = InvoiceUser::class;

    public function definition()
    {
        return [
            'supplier_name' => $this->faker->company,
            'supplier_tax_number' => $this->faker->numerify('########-#-##'),
            'supplier_post_code' => $this->faker->postcode,
            'supplier_town' => $this->faker->city,
            'supplier_street_name' => $this->faker->streetName,
            'supplier_street_category' => $this->faker->randomElement(['Street', 'Avenue', 'Boulevard', 'Lane']),
            'supplier_address' => $this->faker->address,
            'supplier_country' => $this->faker->country,
            'supplier_bank_account_number' => $this->faker->bankAccountNumber,
            'login' => $this->faker->unique()->userName,
            'password' => bcrypt('password'),
            'sign_key' => Str::random(32),
            'exchange_key' => Str::random(32),
            'created_by' => $this->faker->randomDigitNotNull,
            'modified_by' => $this->faker->randomDigitNotNull,
        ];
    }
}
