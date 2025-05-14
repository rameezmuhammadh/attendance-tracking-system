<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'first_name',
        'last_name',
        'is_first_year',
        'class_id',
        'department_id',
        'email',
    ];

    /**
     * Get the department this student belongs to
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the class this student belongs to
     */
    public function studentGroups()
    {
        return $this->belongsTo(StudentGroup::class, 'student_group_id');
    }

    /**
     * Get the subjects this student is enrolled in
     */
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'subject_student')
            ->withPivot('enrollment_date')
            ->withTimestamps();
    }

    /**
     * Get the attendance records for this student
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Calculate attendance percentage for a specific subject and date range
     */
    public function getAttendancePercentage($subjectId, $startDate, $endDate)
    {
        $totalDays = Attendance::where('student_id', $this->id)
            ->where('subject_id', $subjectId)
            ->whereBetween('date', [$startDate, $endDate])
            ->count();

        if ($totalDays === 0) {
            return 0;
        }

        $presentDays = Attendance::where('student_id', $this->id)
            ->where('subject_id', $subjectId)
            ->whereBetween('date', [$startDate, $endDate])
            ->where('is_present', true)
            ->count();

        return ($presentDays / $totalDays) * 100;
    }

    /**
     * Get full name attribute
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
