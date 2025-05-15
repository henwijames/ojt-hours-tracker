<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = ['name', 'status', 'department_id', 'required_hours'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function coordinators()
    {
        return $this->belongsToMany(User::class, 'coordinator_programs', 'program_id', 'coordinator_id');
    }
}
