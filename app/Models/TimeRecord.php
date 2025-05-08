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
    'remarks'
  ];

  protected $casts = [
    'time_in' => 'datetime',
    'time_out' => 'datetime',
    'date' => 'date',
  ];

  public function student()
  {
    return $this->belongsTo(Student::class, 'user_id');
  }

  protected static function boot()
  {
    parent::boot();

    static::saving(function ($record) {
      if ($record->time_in && $record->time_out) {
        $timeIn = \Carbon\Carbon::parse($record->time_in);
        $timeOut = \Carbon\Carbon::parse($record->time_out);
        $hours = $timeOut->diffInMinutes($timeIn) / 60;
        $record->completed_hours = round($hours, 2);
      }
    });
  }
}
