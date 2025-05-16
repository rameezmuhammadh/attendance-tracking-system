<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = Subject::all();

        foreach ($subjects as $subject) {
            // Get teachers for this subject
            $subjectTeachers = $subject->teachers;

            // If no teachers assigned to this subject, skip it
            if ($subjectTeachers->isEmpty()) {
                continue;
            }

            // Get all students enrolled in this subject
            $students = $subject->students;

            // Create attendance records for the last 10 days
            for ($i = 0; $i < 10; $i++) {
                $date = Carbon::now()->subDays($i);

                // For each day, randomly select one of the subject's teachers to mark attendance
                $teacher = $subjectTeachers->random();

                foreach ($students as $student) {
                    // Randomly mark attendance (80% chance of being present)
                    $isPresent = rand(1, 100) <= 80;

                    Attendance::create([
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'date' => $date->format('Y-m-d'),
                        'is_present' => $isPresent,
                        'marked_by' => $teacher->id,
                    ]);
                }
            }
        }
    }
}
