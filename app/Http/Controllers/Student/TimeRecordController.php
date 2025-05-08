<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CompanySubmission;
use App\Models\TimeRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TimeRecordController extends Controller
{
  public function index()
  {
    $submission = CompanySubmission::where('student_id', Auth::id())
      ->where('status', 'approved')
      ->first();

    $required_hours = Auth::user()->student->required_hours;
    if (!$submission) {
      return redirect()->route('student.company.index')->with([
        'toast' => true,
        'type' => 'error',
        'message' => 'Your company submission must be approved first.'
      ]);
    }

    $timeRecords = TimeRecord::where('student_id', Auth::id())
      ->latest()
      ->paginate(10);


    return Inertia::render('student/time-records/index', [
      'timeRecords' => $timeRecords,
      'submission' => $submission,
      'required_hours' => $required_hours
    ]);
  }

  public function timeIn(Request $request)
  {
    $request->validate([
      'image' => 'required|image|max:2048' // 2MB max
    ]);

    $today = now()->toDateString();
    $existingRecord = TimeRecord::where('student_id', Auth::id())
      ->where('date', $today)
      ->first();

    if ($existingRecord && $existingRecord->time_in) {
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => 'You have already timed in today.'
      ]);
    }

    $imagePath = $request->file('image')->store('time-records', 'public');

    if ($existingRecord) {
      $existingRecord->update([
        'time_in' => now(),
        'time_in_image' => $imagePath
      ]);
    } else {
      TimeRecord::create([
        'student_id' => Auth::id(),
        'time_in' => now(),
        'time_in_image' => $imagePath,
        'date' => $today
      ]);
    }

    return back()->with([
      'toast' => true,
      'type' => 'success',
      'message' => 'Time in recorded successfully.'
    ]);
  }

  public function timeOut(Request $request)
  {
    $request->validate([
      'image' => 'required|image|max:2048' // 2MB max
    ]);

    $today = now()->toDateString();
    $record = TimeRecord::where('student_id', Auth::id())
      ->where('date', $today)
      ->first();

    if (!$record || !$record->time_in) {
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => 'You must time in first.'
      ]);
    }

    if ($record->time_out) {
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => 'You have already timed out today.'
      ]);
    }

    $imagePath = $request->file('image')->store('time-records', 'public');

    $record->update([
      'time_out' => now(),
      'time_out_image' => $imagePath
    ]);

    return back()->with([
      'toast' => true,
      'type' => 'success',
      'message' => 'Time out recorded successfully.'
    ]);
  }
}
