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

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,pending',
        ]);

        $student->update($request->only('status'));

        return redirect()->back()->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Student status updated successfully.',
        ]);
    }

    public function updateRequiredHours(Request $request)
    {
        $request->validate([
            'required_hours' => 'required|numeric|min:1',
        ]);

        $coordinator = Auth::user()->coordinator;
        $program = $coordinator->program;

        $program->update([
            'required_hours' => $request->required_hours
        ]);

        return redirect()->back()->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Required hours updated successfully.',
        ]);
    }
}
