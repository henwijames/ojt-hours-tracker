<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/programs', [
            'programs' => Program::with('department')->get(),
            'departments' => Department::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:active,inactive',
        ]);

        Program::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'status' => 'required|in:active,inactive',
            'department_id' => 'required|exists:departments,id',
        ]);

        $program->update([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'department_id' => $validated['department_id'],
        ]);

        // Sync assigned coordinators
        $program->coordinators()->sync($validated['coordinator_ids']);

        return redirect()->route('admin.programs.index')->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Program updated successfully.',
        ]);
    }


    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->back()->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Program deleted successfully.',
        ]);
    }
}
