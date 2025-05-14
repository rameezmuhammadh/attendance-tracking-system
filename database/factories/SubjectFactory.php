<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjectsByDepartment = [
            'Computer Science' => [
                ['name' => 'Introduction to Programming', 'code' => 'CS101'],
                ['name' => 'Data Structures and Algorithms', 'code' => 'CS201'],
                ['name' => 'Database Systems', 'code' => 'CS301'],
                ['name' => 'Computer Networks', 'code' => 'CS401'],
                ['name' => 'Operating Systems', 'code' => 'CS402'],
                ['name' => 'Web Development', 'code' => 'CS403'],
                ['name' => 'Software Engineering', 'code' => 'CS404'],
                ['name' => 'Artificial Intelligence', 'code' => 'CS501'],
            ],
            'Electrical Engineering' => [
                ['name' => 'Circuit Theory', 'code' => 'EE101'],
                ['name' => 'Digital Logic Design', 'code' => 'EE201'],
                ['name' => 'Signals and Systems', 'code' => 'EE301'],
                ['name' => 'Microelectronics', 'code' => 'EE401'],
                ['name' => 'Control Systems', 'code' => 'EE402'],
                ['name' => 'Power Systems', 'code' => 'EE403'],
                ['name' => 'Communication Systems', 'code' => 'EE404'],
            ],
            'Mechanical Engineering' => [
                ['name' => 'Mechanics of Materials', 'code' => 'ME101'],
                ['name' => 'Thermodynamics', 'code' => 'ME201'],
                ['name' => 'Fluid Mechanics', 'code' => 'ME301'],
                ['name' => 'Machine Design', 'code' => 'ME401'],
                ['name' => 'Heat Transfer', 'code' => 'ME402'],
                ['name' => 'Manufacturing Processes', 'code' => 'ME403'],
            ],
            'Civil Engineering' => [
                ['name' => 'Structural Analysis', 'code' => 'CE101'],
                ['name' => 'Geotechnical Engineering', 'code' => 'CE201'],
                ['name' => 'Transportation Engineering', 'code' => 'CE301'],
                ['name' => 'Environmental Engineering', 'code' => 'CE401'],
                ['name' => 'Construction Management', 'code' => 'CE402'],
            ],
            'Business Administration' => [
                ['name' => 'Principles of Management', 'code' => 'BA101'],
                ['name' => 'Financial Accounting', 'code' => 'BA201'],
                ['name' => 'Marketing Management', 'code' => 'BA301'],
                ['name' => 'Business Ethics', 'code' => 'BA401'],
                ['name' => 'Strategic Management', 'code' => 'BA402'],
                ['name' => 'Human Resource Management', 'code' => 'BA403'],
            ],
            'Mathematics' => [
                ['name' => 'Calculus I', 'code' => 'MATH101'],
                ['name' => 'Linear Algebra', 'code' => 'MATH201'],
                ['name' => 'Differential Equations', 'code' => 'MATH301'],
                ['name' => 'Numerical Analysis', 'code' => 'MATH401'],
                ['name' => 'Abstract Algebra', 'code' => 'MATH402'],
            ],
            'Physics' => [
                ['name' => 'Mechanics', 'code' => 'PHY101'],
                ['name' => 'Electromagnetism', 'code' => 'PHY201'],
                ['name' => 'Modern Physics', 'code' => 'PHY301'],
                ['name' => 'Quantum Mechanics', 'code' => 'PHY401'],
                ['name' => 'Thermodynamics and Statistical Mechanics', 'code' => 'PHY402'],
            ],
            'Chemistry' => [
                ['name' => 'General Chemistry', 'code' => 'CHEM101'],
                ['name' => 'Organic Chemistry', 'code' => 'CHEM201'],
                ['name' => 'Physical Chemistry', 'code' => 'CHEM301'],
                ['name' => 'Inorganic Chemistry', 'code' => 'CHEM401'],
                ['name' => 'Analytical Chemistry', 'code' => 'CHEM402'],
            ],
            'Biology' => [
                ['name' => 'Cell Biology', 'code' => 'BIO101'],
                ['name' => 'Molecular Biology', 'code' => 'BIO201'],
                ['name' => 'Genetics', 'code' => 'BIO301'],
                ['name' => 'Ecology', 'code' => 'BIO401'],
                ['name' => 'Evolutionary Biology', 'code' => 'BIO402'],
            ],
            'Psychology' => [
                ['name' => 'Introduction to Psychology', 'code' => 'PSY101'],
                ['name' => 'Cognitive Psychology', 'code' => 'PSY201'],
                ['name' => 'Abnormal Psychology', 'code' => 'PSY301'],
                ['name' => 'Social Psychology', 'code' => 'PSY401'],
                ['name' => 'Developmental Psychology', 'code' => 'PSY402'],
            ],
        ];
        $department = Department::inRandomOrder()->first() ?? Department::factory()->create();
        $departmentName = $department->name;

        // If we don't have predefined subjects for this department, use a generic one
        if (!isset($subjectsByDepartment[$departmentName])) {
            return [
                'name' => $this->faker->words(3, true),
                'code' => strtoupper($department->code . $this->faker->unique()->numberBetween(100, 599)),
                'department_id' => $department->id,
                'description' => $this->faker->paragraph(),
            ];
        }

        // Try to find a subject from the predefined list that doesn't exist in the database yet
        $availableSubjects = collect($subjectsByDepartment[$departmentName]);

        // Check which subject codes are already used
        $usedCodes = \App\Models\Subject::pluck('code')->toArray();

        // Filter out subjects with codes that are already in use
        $availableSubjects = $availableSubjects->filter(function ($item) use ($usedCodes) {
            return !in_array($item['code'], $usedCodes);
        })->values();

        // If no available subjects, create one with random code
        if ($availableSubjects->isEmpty()) {
            $randomName = $this->faker->randomElement($subjectsByDepartment[$departmentName])['name'];
            $uniqueCode = $department->code . $this->faker->unique()->numberBetween(100, 999);

            return [
                'name' => $randomName . ' ' . $this->faker->randomNumber(2),
                'code' => $uniqueCode,
                'department_id' => $department->id,
                'description' => $this->faker->paragraph(),
            ];
        }

        // Pick a random available subject
        $subject = $availableSubjects->random();

        return [
            'name' => $subject['name'],
            'code' => $subject['code'],
            'department_id' => $department->id,
            'description' => $this->faker->paragraph(),
        ];
    }
}
