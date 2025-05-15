<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Announcements;
use App\Models\CompanySubmission;
use App\Models\Student;
use App\Models\TimeRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submission = CompanySubmission::where('student_id', Auth::user()->id)->first();
        $student = Student::where('user_id', Auth::user()->id)->first();
        $announcements = Announcements::where('program_id', Auth::user()->student->program_id)->latest()->limit(2)->get();
        $timeRecords = TimeRecord::where('student_id', Auth::user()->id)->latest()->limit(1)->get();
        $totalTimeRecords = TimeRecord::where('student_id', Auth::user()->id)->count();


        return Inertia::render('student/dashboard', [
            'companySubmission' => $submission,
            'student' => $student,
            'announcements' => $announcements,
            'timeRecords' => $timeRecords,
            'totalTimeRecords' => $totalTimeRecords,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
