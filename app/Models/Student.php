<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'student_id',
        'department_id',
        'program_id',
        'status',
        'completed_hours'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function coordinator()
    {
        return $this->belongsTo(Coordinator::class);
    }

    public function company_submission()
    {
        return $this->hasOne(CompanySubmission::class, 'student_id', 'user_id');
    }

    public function time_records()
    {
        return $this->hasMany(TimeRecord::class, 'user_id');
    }

    public function journals()
    {
        return $this->hasMany(Journal::class, 'student_id')->orderBy('date', 'desc');
    }
}
