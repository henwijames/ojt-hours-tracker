<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\CompanySubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CompanySubmissionController extends Controller
{
  public function index()
  {
    $coordinator = Auth::user()->coordinator;
    $programId = $coordinator->program_id;

    $companySubmissions = CompanySubmission::with(['student.user', 'student.program'])
      ->whereHas('student', function ($query) use ($programId) {
        $query->where('program_id', $programId);
      })
      ->whereHas('student.user')
      ->latest()
      ->paginate(10);

    // For debugging
    Log::info('Company Submissions Query:', [
      'program_id' => $programId,
      'count' => $companySubmissions->total(),
      'sql' => CompanySubmission::with(['student.user', 'student.program'])
        ->whereHas('student', function ($query) use ($programId) {
          $query->where('program_id', $programId);
        })
        ->whereHas('student.user')
        ->toSql()
    ]);

    return Inertia::render('coordinator/company-submissions/index', [
      'companySubmissions' => $companySubmissions,
    ]);
  }

  public function approve(CompanySubmission $companySubmission)
  {
    // Ensure the submission belongs to a student in the coordinator's program
    if ($companySubmission->student->program_id != Auth::user()->coordinator->program_id) {
      abort(403);
    }

    $companySubmission->update([
      'status' => 'approved',
      'approved_at' => now(),
    ]);

    return redirect()->back()->with([
      'toast' => true,
      'type' => 'success',
      'message' => 'Company submission approved successfully.',
    ]);
  }

  public function reject(CompanySubmission $companySubmission)
  {
    // Ensure the submission belongs to a student in the coordinator's program
    if ($companySubmission->student->program_id != Auth::user()->coordinator->program_id) {
      abort(403);
    }

    $companySubmission->update([
      'status' => 'rejected',
      'rejected_at' => now(),
    ]);

    return redirect()->back()->with([
      'toast' => true,
      'type' => 'success',
      'message' => 'Company submission rejected successfully.',
    ]);
  }
}
