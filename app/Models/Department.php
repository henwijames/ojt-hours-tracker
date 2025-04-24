<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'status', // Include any other fields you want to be mass assignable
    ];

    public function programs()
    {
        return $this->hasMany(Program::class);
    }
}
