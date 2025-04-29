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
        $coordinators = User::where('role', 'coordinator')
            ->with(['coordinator.department', 'coordinator.program'])
            ->paginate(10);

        // Get students with pagination  
        $students = User::where('role', 'student')
            ->with(['student.department', 'student.program'])
            ->paginate(10);

        return Inertia::render('coordinator/dashboard', [
            'user' => Auth::user(),
            'coordinatorCount' => Coordinator::count(),
            'studentsCount' => Student::count(),
            'programsCount' => Program::count(),
            'departmentsCount' => Department::count(),
            'coordinators' => $coordinators,
            'students' => $students,
        ]);
    }
}
