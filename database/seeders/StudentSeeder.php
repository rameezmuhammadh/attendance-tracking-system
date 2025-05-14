<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10-20 students for each group
        StudentGroup::all()->each(function ($group) {
            $numberOfStudents = rand(10, 20);
            Student::factory($numberOfStudents)->create([
                'student_group_id' => $group->id,
                'department_id' => $group->department_id
            ]);
        });
    }
}
