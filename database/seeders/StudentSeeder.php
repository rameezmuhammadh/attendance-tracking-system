<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Student;
use App\Models\StudentGroup;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all();
        $studentGroups = StudentGroup::all();
        $subjects = Subject::all();

        // Generate 30 students
        for ($i = 1; $i <= 30; $i++) {
            $isFirstYear = $i <= 25; // First 25 students are first year
            $department = $departments->random();
            $studentGroup = $studentGroups->random();

            $firstName = fake()->firstName();
            $lastName = fake()->lastName();

            $student = Student::create([
                'registration_number' => 'STU' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => strtolower($firstName . '.' . $lastName . '@student.example.com'),
                'is_first_year' => $isFirstYear,
                'department_id' => $department->id,
                'student_group_id' => $studentGroup->id,
            ]);

            // For first year students, assign 3-5 random subjects
            if ($isFirstYear) {
                $numSubjects = rand(3, 5);
                $randomSubjects = $subjects->random($numSubjects);

                $pivotData = [];
                foreach ($randomSubjects as $subject) {
                    $pivotData[$subject->id] = ['enrollment_date' => now()->format('Y-m-d')];
                }

                $student->subjects()->attach($pivotData);
            }
        }
    }
}
