<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin users
        $admins = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => 'password',
                'role' => 'admin',
                'department_id' => Department::first()->id,
            ],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => 'password',
                'role' => 'admin',
                'department_id' => Department::first()->id,
            ],
        ];

        foreach ($admins as $admin) {
            User::create([
                'name' => $admin['name'],
                'email' => $admin['email'],
                'password' => Hash::make($admin['password']),
                'role' => $admin['role'],
                'department_id' => $admin['department_id'],
            ]);
        }

        // Create teachers
        $departments = Department::all();
        $subjects = Subject::all();
        $teacherNames = [
            'John Smith',
            'Sarah Johnson',
            'Michael Brown',
            'Emily Davis',
            'David Wilson',
            'Lisa Anderson',
            'Robert Taylor',
            'Jennifer Martinez',
            'William Thomas',
            'Elizabeth Jackson',
            'James White',
            'Patricia Harris',
            'Richard Martin',
            'Barbara Thompson',
            'Charles Garcia'
        ];

        // First, ensure each subject has at least one teacher
        foreach ($subjects as $index => $subject) {
            $department = $departments->random();
            $teacherName = $teacherNames[$index % count($teacherNames)];

            $teacher = User::create([
                'name' => $teacherName,
                'email' => strtolower(str_replace(' ', '.', $teacherName)) . '.' . ($index + 1) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'department_id' => $department->id,
            ]);

            // Assign this subject to the teacher
            $teacher->subjects()->attach($subject->id);
        }

        // Then, create remaining teachers with random subject assignments
        $remainingTeachers = array_diff($teacherNames, array_column(User::where('role', 'teacher')->get()->toArray(), 'name'));
        $teacherCount = User::where('role', 'teacher')->count();

        foreach ($remainingTeachers as $index => $name) {
            $department = $departments->random();

            $teacher = User::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '.' . ($teacherCount + $index + 1) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'department_id' => $department->id,
            ]);

            // Assign 1-2 additional random subjects to each teacher
            $numSubjects = rand(1, 2);
            $randomSubjects = $subjects->random($numSubjects);
            $teacher->subjects()->attach($randomSubjects->pluck('id'));
        }
    }
}
