<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySubmission extends Model
{
    protected $fillable = [
        'student_id',
        'company_name',
        'company_address',
        'supervisor_name',
        'supervisor_contact',
        'moa_path',
        'status',
        'submitted_at',
        'approved_at',
        'rejected_at',
        'remarks',
    ];

    protected $dates = [
        'submitted_at',
        'approved_at',
        'rejected_at',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }
}
