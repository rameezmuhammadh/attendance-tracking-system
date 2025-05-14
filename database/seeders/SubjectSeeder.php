<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5-8 subjects for each department
        Department::all()->each(function ($department) {
            $numberOfSubjects = rand(5, 8);

            // Create subjects one by one to handle any unique constraint errors
            for ($i = 0; $i < $numberOfSubjects; $i++) {
                try {
                    Subject::factory()->create([
                        'department_id' => $department->id
                    ]);
                } catch (\Exception $e) {
                    // Skip if there's a duplicate code error
                    continue;
                }
            }
        });
    }
}
