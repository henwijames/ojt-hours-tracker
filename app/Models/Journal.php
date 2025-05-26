<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = [
        'title',
        'description',
        'date',
        'student_id',
        'status'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
