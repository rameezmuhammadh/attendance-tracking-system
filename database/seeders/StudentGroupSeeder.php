<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\StudentGroup;
use Illuminate\Database\Seeder;

class StudentGroupSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::all();

        $groups = [
            ['name' => 'Group A', 'description' => 'First year students group A'],
            ['name' => 'Group B', 'description' => 'First year students group B'],
            ['name' => 'Group C', 'description' => 'First year students group C'],
            ['name' => 'Group D', 'description' => 'First year students group D'],
            ['name' => 'Group E', 'description' => 'First year students group E'],
        ];

        foreach ($groups as $group) {
            // Assign each group to a different department
            $department = $departments->shift();
            if (!$department) {
                $department = Department::first();
            }

            StudentGroup::create([
                'name' => $group['name'],
                'description' => $group['description'],
                'department_id' => $department->id,
            ]);
        }
    }
}
