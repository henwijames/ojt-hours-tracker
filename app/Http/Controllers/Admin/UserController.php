<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::whereIn('role', ['student', 'coordinator'])
            ->with(['student.department', 'student.program', 'coordinator.department', 'coordinator.program'])
            ->get();
        $departments = Department::with('programs')->get();
        $coordinators = $users->where('role', 'coordinator')->values(); // Convert to array
        $students = $users->where('role', 'student')->values(); // Convert to array

        return Inertia::render('admin/users', [
            'coordinators' => $coordinators,
            'students' => $students,
            'departments' => $departments,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);


        if ($user->student) {
            $user->student->update([
                'status' => $request->status,
            ]);
        }

        if ($user->coordinator) {
            $user->coordinator->update([
                'status' => $request->status,
                'department_id' => $request->department_id,
                'program_id' => $request->program_id,
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
