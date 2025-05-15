<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeRecord extends Model
{
  protected $fillable = [
    'student_id',
    'time_in',
    'time_out',
    'date',
    'time_in_image',
    'time_out_image',
    'remarks',
    'rendered_hours'
  ];

  protected $casts = [
    'time_in' => 'datetime',
    'time_out' => 'datetime',
    'date' => 'date',
    'rendered_hours' => 'float'
  ];

  protected $dates = [
    'time_in',
    'time_out',
    'date'
  ];

  public function student()
  {
    return $this->belongsTo(Student::class, 'student_id', 'user_id');
  }
}
