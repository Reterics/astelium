<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Task;
use App\Models\Project;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'account_id' => Account::inRandomOrder()->first()->id ?? Account::factory(), // Ensure account is set
            'project_id' => Project::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['open', 'in-progress', 'review', 'completed', 'closed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'assigned_to' => User::factory(),
            'start_time' => $this->faker->dateTime,
            'expected_time' => $this->faker->numberBetween(1, 48),
            'order_index' => 0,
        ];
    }

    public function configure(): TaskFactory
    {
        return $this->afterCreating(function (Task $task) {
            $task->update(['order_index' => $task->id]);
        });
    }
}
