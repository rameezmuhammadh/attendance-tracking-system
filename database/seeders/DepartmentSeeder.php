<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Computer Science', 'code' => 'CS', 'description' => 'Department of Computer Science'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Department of Information Technology'],
            ['name' => 'Software Engineering', 'code' => 'SE', 'description' => 'Department of Software Engineering'],
            ['name' => 'Data Science', 'code' => 'DS', 'description' => 'Department of Data Science'],
            ['name' => 'Computer Engineering', 'code' => 'CE', 'description' => 'Department of Computer Engineering'],
            ['name' => 'Information Systems', 'code' => 'IS', 'description' => 'Department of Information Systems'],
            ['name' => 'Cybersecurity', 'code' => 'CYB', 'description' => 'Department of Cybersecurity'],
            ['name' => 'Artificial Intelligence', 'code' => 'AI', 'description' => 'Department of Artificial Intelligence'],
            ['name' => 'Network Engineering', 'code' => 'NE', 'description' => 'Department of Network Engineering'],
            ['name' => 'Web Development', 'code' => 'WD', 'description' => 'Department of Web Development'],
            ['name' => 'Mobile Computing', 'code' => 'MC', 'description' => 'Department of Mobile Computing'],
            ['name' => 'Cloud Computing', 'code' => 'CC', 'description' => 'Department of Cloud Computing'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
