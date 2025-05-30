<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Student;
use App\Models\Journal;
use App\Models\TimeRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $coordinator = Auth::user()->coordinator()->with(['department', 'program'])->first();

        $departments = Department::with('programs')->get();

        $students = Student::with(['user', 'department', 'program', 'company_submission'])
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->where('department_id', $coordinator->department_id)
            ->paginate(10);

        return Inertia::render('coordinator/students', [
            'students' => $students,
            'departments' => $departments,
            'coordinator' => $coordinator,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,pending',
        ]);

        $student->status = $request->status;
        $student->save();

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

        $program->required_hours = $request->required_hours;
        $program->save();

        return redirect()->back()->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Required hours updated successfully.',
        ]);
    }

    public function show(Student $student)
    {
        $coordinator = Auth::user()->coordinator;

        $student = Student::with(['user', 'department', 'program'])
            ->where('user_id', $student->user_id)
            ->where('program_id', $coordinator->program_id)
            ->firstOrFail();

        $journals = Journal::where('student_id', $student->user_id)->get();

        return Inertia::render('coordinator/student-journals', [
            'student' => $student,
            'journals' => $journals,
        ]);
    }

    public function ojtLogs(Student $student)
    {
        $coordinator = Auth::user()->coordinator;

        $student = Student::with(['user', 'department', 'program'])
            ->where('user_id', $student->user_id)
            ->where('program_id', $coordinator->program_id)
            ->firstOrFail();

        $timeRecords = TimeRecord::where('student_id', $student->user_id)
            ->latest()
            ->paginate(10)
            ->through(function ($record) {
                $baseUrl = app()->environment('production')
                    ? env('AWS_URL')
                    : '/storage';

                $timeInImageUrl = $record->time_in_image ? "{$baseUrl}/{$record->time_in_image}" : null;
                $timeOutImageUrl = $record->time_out_image ? "{$baseUrl}/{$record->time_out_image}" : null;

                return [
                    'id' => $record->id,
                    'date' => $record->date,
                    'time_in' => $record->time_in,
                    'time_out' => $record->time_out,
                    'time_in_image' => $timeInImageUrl,
                    'time_out_image' => $timeOutImageUrl,
                    'hours_rendered' => $record->hours_rendered,
                ];
            });
        // dd($timeRecords);

        return Inertia::render('coordinator/student-ojt-logs', [
            'student' => $student,
            'timeRecords' => $timeRecords,
        ]);
    }
}
