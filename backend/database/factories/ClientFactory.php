<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'account_id' => Account::inRandomOrder()->first()->id ?? Account::factory(), // Ensure account is set
            'name' => $this->faker->company,
            'tax_number' => $this->faker->numerify('########-#-##'),
            'post_code' => $this->faker->postcode,
            'town' => $this->faker->city,
            'street_name' => $this->faker->streetName,
            'street_category' => $this->faker->randomElement(["utca",
                "út",
                "útja",
                "allé",
                "alsó rakpart",
                "alsósor",
                "bekötőút",
                "dűlő",
                "fasor",
                "felső rakpart",
                "felsősor",
                "főtér",
                "főút",
                "gát",
                "határ",
                "határsor",
                "határút",
                "hrsz",]),
            'address' => $this->faker->address,
            'country' => $this->faker->country,
            'bank_account_number' => $this->faker->bankAccountNumber,
            'type' => $this->faker->randomElement(['PERSON', 'COMPANY_HU', 'COMPANY_EU', 'COMPANY']),
            'vat_status' => $this->faker->randomElement(['PRIVATE_PERSON', 'DOMESTIC', 'OTHER']),
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'company' => $this->faker->company,
        ];
    }
}
