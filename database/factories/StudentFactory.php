<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\StudentGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = $this->faker->randomElement([2021, 2022, 2023, 2024, 2025]);
        $registrationPrefix = 'ST' . $year;
        $firstName = $this->faker->firstName();
        $lastName = $this->faker->lastName();
        $group = StudentGroup::inRandomOrder()->first() ?? StudentGroup::factory()->create();

        return [
            'registration_number' => $registrationPrefix . $this->faker->unique()->randomNumber(5),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'is_first_year' => $year == 2025, // First year if registered in current year
            'student_group_id' => $group->id,
            'department_id' => $group->department_id,
            'email' => strtolower($firstName . '.' . $lastName . '@student.example.com'),
        ];
    }
}
