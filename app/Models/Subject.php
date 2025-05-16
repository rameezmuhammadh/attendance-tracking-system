<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    /**
     * Get the teachers for this subject
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
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
