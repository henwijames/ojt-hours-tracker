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
        $companySubmission = CompanySubmission::where('student_id', Auth::user()->id)->first();
        return Inertia::render('student/company/index', [
            'companySubmission' => $companySubmission,
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
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string',
            'supervisor_name' => 'required|string|max:255',
            'supervisor_contact' => 'required|numeric',
        ]);

        $validated['student_id'] = Auth::id();
        $validated['submitted_at'] = now();

        if ($request->hasFile('moa_path')) {
            $validate['moa_path'] = $request->file('moa_path')->store('moa', 'public');
        }

        CompanySubmission::create($validate);

        return redirect()->back()->with([
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
    public function edit()
    {
        $companySubmission = CompanySubmission::where('student_id', Auth::user()->student->id)
            ->where('status', 'rejected')
            ->orWhere('status', 'pending')
            ->firstOrFail();

        return Inertia::render('student/company/edit', [
            'companySubmission' => $companySubmission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CompanySubmission $companySubmission)
    {
        // Ensure the company submission belongs to the authenticated student
        if ($companySubmission->student_id !== Auth::user()->id) {
            abort(403);
        }

        // Ensure the submission is in a state that can be updated
        if (!in_array($companySubmission->status, ['rejected', 'pending'])) {
            abort(403);
        }

        $validate = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string',
            'supervisor_name' => 'required|string|max:255',
            'supervisor_contact' => 'required|numeric',
            'moa_path' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $validate['status'] = 'pending';
        $validate['submitted_at'] = now();

        if ($request->hasFile('moa_path')) {
            $validate['moa_path'] = $request->file('moa_path')->store('moa', 'public');
        }

        $companySubmission->update($validate);

        return redirect()->route('student.company.index')->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Company submission updated successfully.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
