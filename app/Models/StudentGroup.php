<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentGroup extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'department_id',
        'description',
    ];

    /**
     * Get the department that owns the student group
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the students belonging to this student group
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'student_group_id');
    }
}
