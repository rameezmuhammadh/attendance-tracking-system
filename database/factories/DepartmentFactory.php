<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Department>
 */
class DepartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = [
            ['name' => 'Computer Science', 'code' => 'CS'],
            ['name' => 'Electrical Engineering', 'code' => 'EE'],
            ['name' => 'Mechanical Engineering', 'code' => 'ME'],
            ['name' => 'Civil Engineering', 'code' => 'CE'],
            ['name' => 'Business Administration', 'code' => 'BA'],
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
            ['name' => 'Biology', 'code' => 'BIO'],
            ['name' => 'Psychology', 'code' => 'PSY'],
        ];

        $department = $this->faker->unique()->randomElement($departments);

        return [
            'name' => $department['name'],
            'code' => $department['code'],
            'description' => $this->faker->paragraph(),
        ];
    }
}
