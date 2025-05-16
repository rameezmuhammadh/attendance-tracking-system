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
            ['name' => 'Introduction to Programming', 'code' => 'CS101', 'description' => 'Basic programming concepts and problem-solving'],
            ['name' => 'Data Structures', 'code' => 'CS201', 'description' => 'Study of fundamental data structures and algorithms'],
            ['name' => 'Database Systems', 'code' => 'CS301', 'description' => 'Database design and management'],
            ['name' => 'Web Development', 'code' => 'CS401', 'description' => 'Front-end and back-end web development'],
            ['name' => 'Software Engineering', 'code' => 'CS501', 'description' => 'Software development methodologies and practices'],
            ['name' => 'Computer Networks', 'code' => 'CS601', 'description' => 'Network protocols and architecture'],
            ['name' => 'Operating Systems', 'code' => 'CS701', 'description' => 'OS concepts and implementation'],
            ['name' => 'Artificial Intelligence', 'code' => 'CS801', 'description' => 'AI algorithms and applications'],
            ['name' => 'Machine Learning', 'code' => 'CS802', 'description' => 'ML algorithms and data analysis'],
            ['name' => 'Cybersecurity', 'code' => 'CS901', 'description' => 'Security principles and practices'],
            ['name' => 'Cloud Computing', 'code' => 'CS902', 'description' => 'Cloud services and deployment'],
            ['name' => 'Mobile App Development', 'code' => 'CS903', 'description' => 'Mobile application development'],
            ['name' => 'Data Science', 'code' => 'CS904', 'description' => 'Data analysis and visualization'],
            ['name' => 'Computer Graphics', 'code' => 'CS905', 'description' => 'Graphics programming and design'],
            ['name' => 'Software Testing', 'code' => 'CS906', 'description' => 'Testing methodologies and tools'],
            ['name' => 'Big Data Analytics', 'code' => 'CS907', 'description' => 'Large-scale data processing'],
            ['name' => 'Internet of Things', 'code' => 'CS908', 'description' => 'IoT systems and applications'],
            ['name' => 'Blockchain Technology', 'code' => 'CS909', 'description' => 'Blockchain concepts and development'],
            ['name' => 'Game Development', 'code' => 'CS910', 'description' => 'Game design and programming'],
            ['name' => 'Natural Language Processing', 'code' => 'CS911', 'description' => 'NLP algorithms and applications'],
            ['name' => 'Computer Vision', 'code' => 'CS912', 'description' => 'Image processing and analysis'],
            ['name' => 'Distributed Systems', 'code' => 'CS913', 'description' => 'Distributed computing concepts'],
            ['name' => 'Software Architecture', 'code' => 'CS914', 'description' => 'System design and architecture'],
            ['name' => 'Human-Computer Interaction', 'code' => 'CS915', 'description' => 'UI/UX design principles'],
            ['name' => 'Quantum Computing', 'code' => 'CS916', 'description' => 'Quantum computing fundamentals'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
