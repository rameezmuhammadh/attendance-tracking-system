<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    /**
     * Get the classes belonging to this department
     */
    public function studentGroups()
    {
        return $this->hasMany(StudentGroup::class);
    }

    /**
     * Get the subjects belonging to this department
     */
    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    /**
     * Get the students belonging to this department
     */
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Get the teachers belonging to this department
     */
    public function teachers()
    {
        return $this->hasMany(User::class)->where('role', 'teacher');
    }
}
