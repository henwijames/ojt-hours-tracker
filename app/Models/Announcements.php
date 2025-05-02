<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcements extends Model
{
    //

    protected $fillable = [
        'title',
        'body',
        'type',
        'coordinator_id',
        'department_id',
        'program_id',
    ];

    public function coordinator()
    {
        return $this->belongsTo(Coordinator::class);
    }
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
