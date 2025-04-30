<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $coordinator = Auth::user()->coordinator()->with(['department', 'program'])->first();

        $departments = Department::with('programs')->get();

        $students = Student::with(['user', 'department', 'program'])->where('department_id', $coordinator->department_id)->paginate(10);

        return Inertia::render('coordinator/students', [
            'students' => $students,
            'departments' => $departments,
            'coordinator' => $coordinator,
        ]);
    }
}
