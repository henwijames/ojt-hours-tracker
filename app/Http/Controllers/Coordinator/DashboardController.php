<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Coordinator;
use App\Models\Department;
use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $coordinator = Auth::user()->coordinator()->with(['department', 'program'])->first();

        if (!$coordinator) {
            abort(403, 'Coordinator not found or not linked to user.');
        }

        $students = Student::with(['user', 'department', 'program'])->where('department_id', $coordinator->department_id)->paginate(10);

        // dd($students);

        return Inertia::render('coordinator/dashboard', [
            'user' => Auth::user(),
            'coordinatorCount' => Coordinator::count(),
            'studentsCount' => Student::count(),
            'programsCount' => Program::count(),
            'departmentsCount' => Department::count(),
            'students' => $students,
            'coordinator' => $coordinator,
        ]);
    }
}
