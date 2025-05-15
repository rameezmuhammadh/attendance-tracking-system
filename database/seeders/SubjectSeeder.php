<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Subject;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Factory::create();

        $subjects = [
            ['name' => 'Introduction to Programming', 'code' => 'CS101'],
            ['name' => 'Data Structures and Algorithms', 'code' => 'CS201'],
            ['name' => 'Database Systems', 'code' => 'CS301'],
            ['name' => 'Computer Networks', 'code' => 'CS401'],
            ['name' => 'Operating Systems', 'code' => 'CS402'],
            ['name' => 'Web Development', 'code' => 'CS403'],
            ['name' => 'Software Engineering', 'code' => 'CS404'],
            ['name' => 'Artificial Intelligence', 'code' => 'CS501'],

            ['name' => 'Circuit Theory', 'code' => 'EE101'],
            ['name' => 'Digital Logic Design', 'code' => 'EE201'],
            ['name' => 'Signals and Systems', 'code' => 'EE301'],
            ['name' => 'Microelectronics', 'code' => 'EE401'],
            ['name' => 'Control Systems', 'code' => 'EE402'],
            ['name' => 'Power Systems', 'code' => 'EE403'],
            ['name' => 'Communication Systems', 'code' => 'EE404'],

            ['name' => 'Mechanics of Materials', 'code' => 'ME101'],
            ['name' => 'Thermodynamics', 'code' => 'ME201'],
            ['name' => 'Fluid Mechanics', 'code' => 'ME301'],
            ['name' => 'Machine Design', 'code' => 'ME401'],
            ['name' => 'Heat Transfer', 'code' => 'ME402'],
            ['name' => 'Manufacturing Processes', 'code' => 'ME403'],

            ['name' => 'Structural Analysis', 'code' => 'CE101'],
            ['name' => 'Geotechnical Engineering', 'code' => 'CE201'],
            ['name' => 'Transportation Engineering', 'code' => 'CE301'],
            ['name' => 'Environmental Engineering', 'code' => 'CE401'],
            ['name' => 'Construction Management', 'code' => 'CE402'],

            ['name' => 'Principles of Management', 'code' => 'BA101'],
            ['name' => 'Financial Accounting', 'code' => 'BA201'],
            ['name' => 'Marketing Management', 'code' => 'BA301'],
            ['name' => 'Business Ethics', 'code' => 'BA401'],
            ['name' => 'Strategic Management', 'code' => 'BA402'],
            ['name' => 'Human Resource Management', 'code' => 'BA403'],

            ['name' => 'Calculus I', 'code' => 'MATH101'],
            ['name' => 'Linear Algebra', 'code' => 'MATH201'],
            ['name' => 'Differential Equations', 'code' => 'MATH301'],
            ['name' => 'Numerical Analysis', 'code' => 'MATH401'],
            ['name' => 'Abstract Algebra', 'code' => 'MATH402'],

            ['name' => 'Mechanics', 'code' => 'PHY101'],
            ['name' => 'Electromagnetism', 'code' => 'PHY201'],
            ['name' => 'Modern Physics', 'code' => 'PHY301'],
            ['name' => 'Quantum Mechanics', 'code' => 'PHY401'],
            ['name' => 'Thermodynamics and Statistical Mechanics', 'code' => 'PHY402'],

            ['name' => 'General Chemistry', 'code' => 'CHEM101'],
            ['name' => 'Organic Chemistry', 'code' => 'CHEM201'],
            ['name' => 'Physical Chemistry', 'code' => 'CHEM301'],
            ['name' => 'Inorganic Chemistry', 'code' => 'CHEM401'],
            ['name' => 'Analytical Chemistry', 'code' => 'CHEM402'],

            ['name' => 'Cell Biology', 'code' => 'BIO101'],
            ['name' => 'Molecular Biology', 'code' => 'BIO201'],
            ['name' => 'Genetics', 'code' => 'BIO301'],
            ['name' => 'Ecology', 'code' => 'BIO401'],
            ['name' => 'Evolutionary Biology', 'code' => 'BIO402'],

            ['name' => 'Introduction to Psychology', 'code' => 'PSY101'],
            ['name' => 'Cognitive Psychology', 'code' => 'PSY201'],
            ['name' => 'Abnormal Psychology', 'code' => 'PSY301'],
            ['name' => 'Social Psychology', 'code' => 'PSY401'],
            ['name' => 'Developmental Psychology', 'code' => 'PSY402'],
        ];

        foreach ($subjects as $subject) {
            Subject::create([
                'name' => $subject['name'],
                'code' => $subject['code'],
                'description' => $faker->paragraph(3),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
