<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CompanySubmission;
use App\Models\Student;
use App\Models\TimeRecord;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class TimeRecordController extends Controller
{
  private const MAX_IMAGE_SIZE = 2048; // 2MB in KB
  private const STORAGE_DISK = 'public';
  private const STORAGE_PATH = 'time-records';

  public function index()
  {
    $student = Auth::user()->student;
    $today = Carbon::now()->toDateString();

    $submission = $this->getApprovedSubmission();
    if (!$submission) {
      return $this->redirectWithError('student.company.index', 'Your company submission must be approved first.');
    }

    $timeRecords = TimeRecord::with('student')
      ->where('student_id', Auth::id())
      ->latest()
      ->paginate(10);

    $timeRecordToday = TimeRecord::where('student_id', Auth::id())
      ->where('date', $today)
      ->first();

    $timeIn = $timeRecordToday?->time_in;
    $timeOut = $timeRecordToday?->time_out;
    $renderedHours = $this->calculateRenderedHours($timeRecordToday);

    return Inertia::render('student/time-records/index', [
      'timeRecords' => $timeRecords,
      'submission' => $submission,
      'required_hours' => $student->program->required_hours,
      'completed_hours' => (float) $student->completed_hours,
      'time_in' => $timeIn,
      'time_out' => $timeOut,
      'timeRecordToday' => $timeRecordToday,
      'rendered_hours' => $renderedHours
    ]);
  }

  public function timeIn(Request $request): RedirectResponse
  {
    try {
      $this->validateTimeRecordImage($request);
      $today = now()->toDateString();

      $existingRecord = $this->getTodayTimeRecord($today);
      if ($existingRecord && $existingRecord->time_in) {
        throw ValidationException::withMessages([
          'time_in' => 'You have already clocked in today.'
        ]);
      }

      $imagePath = $this->storeTimeRecordImage($request->file('image'));

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

      return $this->redirectWithSuccess('Time in recorded successfully.');
    } catch (ValidationException $e) {
      return $this->handleValidationError($e);
    } catch (\Exception $e) {
      Log::error('Time in error: ' . $e->getMessage(), [
        'user_id' => Auth::id(),
        'trace' => $e->getTraceAsString()
      ]);
      return $this->redirectWithError(null, 'Failed to record time in. Please try again.');
    }
  }

  public function timeOut(Request $request): RedirectResponse
  {
    try {
      $this->validateTimeRecordImage($request);
      $today = now()->toDateString();

      $record = $this->getTodayTimeRecord($today);
      $this->validateTimeOut($record);

      $imagePath = $this->storeTimeRecordImage($request->file('image'));
      $hoursWorked = $this->calculateHoursWorked($record->time_in);

      $this->updateTimeRecord($record, $imagePath);
      $this->updateStudentHours($hoursWorked);

      return $this->redirectWithSuccess('Time out recorded successfully.');
    } catch (ValidationException $e) {
      return $this->handleValidationError($e);
    } catch (\Exception $e) {
      Log::error('Time out error: ' . $e->getMessage(), [
        'user_id' => Auth::id(),
        'trace' => $e->getTraceAsString()
      ]);
      return $this->redirectWithError(null, 'Failed to record time out: ' . $e->getMessage());
    }
  }

  private function getApprovedSubmission()
  {
    return CompanySubmission::where('student_id', Auth::id())
      ->where('status', 'approved')
      ->first();
  }

  private function getTodayTimeRecord(string $date)
  {
    return TimeRecord::select('id', 'student_id', 'time_in', 'time_out', 'date')
      ->where('student_id', Auth::id())
      ->where('date', $date)
      ->first();
  }

  private function validateTimeRecordImage(Request $request): void
  {
    $request->validate([
      'image' => 'required|image|max:' . self::MAX_IMAGE_SIZE
    ], [
      'image.required' => 'Please upload a photo for time record.',
      'image.image' => 'The file must be an image.',
      'image.max' => 'The image size must not exceed 2MB.'
    ]);
  }

  private function validateTimeOut(?TimeRecord $record): void
  {
    if (!$record || !$record->getAttribute('time_in')) {
      throw ValidationException::withMessages([
        'time_out' => 'You must clock in first.'
      ]);
    }

    if ($record->getAttribute('time_out')) {
      throw ValidationException::withMessages([
        'time_out' => 'You have already clocked out today.'
      ]);
    }
  }

  private function storeTimeRecordImage($file): string
  {
    $path = $file->store(self::STORAGE_PATH, self::STORAGE_DISK);
    if (!$path) {
      throw new \Exception('Failed to upload image.');
    }
    return $path;
  }

  private function calculateHoursWorked(Carbon $timeIn): float
  {
    return abs(Carbon::now()->floatDiffInHours($timeIn));
  }

  private function updateTimeRecord(TimeRecord $record, string $imagePath): void
  {
    $record->time_out = now();
    $renderedHours = $this->calculateRenderedHours($record);

    $record->update([
      'time_out' => $record->time_out,
      'time_out_image' => $imagePath,
      'rendered_hours' => $renderedHours
    ]);
  }

  private function updateStudentHours(float $hoursWorked): void
  {
    $student = Auth::user()->student;
    if (!$student) {
      throw new \Exception('Student record not found.');
    }

    $student->completed_hours = ($student->completed_hours ?? 0) + $hoursWorked;
    $student->save();
  }

  private function calculateRenderedHours(?TimeRecord $record): float
  {
    if (!$record || !$record->time_in || !$record->time_out) {
      return 0;
    }

    $timeIn = Carbon::parse($record->time_in);
    $timeOut = Carbon::parse($record->time_out);

    return round(abs($timeOut->floatDiffInHours($timeIn)), 2);
  }

  private function redirectWithSuccess(string $message): RedirectResponse
  {
    return back()->with([
      'toast' => true,
      'type' => 'success',
      'message' => $message
    ]);
  }

  private function redirectWithError(?string $route, string $message): RedirectResponse
  {
    $response = back()->with([
      'toast' => true,
      'type' => 'error',
      'message' => $message
    ]);

    return $route ? $response->withErrors(['error' => $message]) : $response;
  }

  private function handleValidationError(ValidationException $e): RedirectResponse
  {
    Log::warning('Time record validation error: ' . $e->getMessage(), [
      'user_id' => Auth::id(),
      'errors' => $e->errors()
    ]);

    return back()->with([
      'toast' => true,
      'type' => 'error',
      'message' => $e->getMessage()
    ])->withErrors($e->errors());
  }
}
