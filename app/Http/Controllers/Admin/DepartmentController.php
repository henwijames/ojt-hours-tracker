<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/departments', [
            'departments' => Department::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:departments,name|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        Department::create($request->only('name', 'status'));

        return redirect()->back();
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'status' => 'required|in:active,inactive',
        ]);

        $department->update($request->only('name', 'status'));

        return redirect()->back();
    }
    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->back();
    }
}
