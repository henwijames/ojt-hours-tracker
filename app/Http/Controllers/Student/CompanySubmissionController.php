<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CompanySubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Symfony\Component\Clock\now;

class CompanySubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submission = CompanySubmission::where('student_id', Auth::user()->id)->first();

        return Inertia::render('student/company/index', [
            'companySubmission' => $submission,
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
        $validated = $request->validate([
            'company_name' => 'required|string',
            'company_address' => 'required|string',
            'supervisor_name' => 'required|string',
            'supervisor_contact' => ['required', 'regex:/^[0-9]+$/'],
        ]);

        $validated['student_id'] = Auth::id();
        $validated['submitted_at'] = now();

        // dd($validated);
        CompanySubmission::create($validated);

        return redirect()->route('student.company.index')->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Company submission created successfully.',
        ]);
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
