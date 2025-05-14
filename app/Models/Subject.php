<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'department_id',
        'description',
    ];

    /**
     * Get the department this subject belongs to
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the classes this subject is taught in
     */
    public function classes()
    {
        return $this->belongsToMany(ClassGroup::class, 'class_subject')
            ->withTimestamps();
    }

    /**
     * Get the teachers assigned to this subject
     */
    public function teachers()
    {
        return $this->belongsToMany(User::class, 'subject_teacher')
            ->withTimestamps();
    }

    /**
     * Get the students enrolled in this subject
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'subject_student')
            ->withPivot('enrollment_date')
            ->withTimestamps();
    }

    /**
     * Get the attendance records for this subject
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
