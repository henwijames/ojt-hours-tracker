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
  private string $storageDisk;
  private const STORAGE_PATH = 'time-records';
  public function __construct()
  {
    $this->storageDisk = 'public';

    Log::info('Storage disk initialized', [
      'storage_disk' => $this->storageDisk,
      'environment' => env('APP_ENV'),
      'app_environment' => app()->environment()
    ]);
  }

  public function index()
  {
    $student = Auth::user()->student()->with('department', 'company_submission')->first();
    $today = Carbon::now()->toDateString();

    $submission = $this->getApprovedSubmission();
    if (!$submission) {
      return $this->redirectWithError('student.company.index', 'Your company submission must be approved first.');
    }

    $timeRecords = TimeRecord::with('student')
      ->where('student_id', Auth::id())
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
          'rendered_hours' => $record->rendered_hours,
          'student' => $record->student
        ];
      });

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
      'rendered_hours' => $renderedHours,
      'student' => $student
    ]);
  }

  public function timeInPage()
  {
    $student = Auth::user()->student;
    if (!$student->face_descriptor) {
      return $this->redirectWithError('student.face-recognition.index', 'Please register your face first before time in.');
    }

    return Inertia::render('student/time-records/time-in');
  }
  public function timeOutPage()
  {
    $student = Auth::user()->student;

    if (!$student->face_descriptor) {
      return $this->redirectWithError('student.face-recognition.index', 'Please register your face first before time out.');
    }

    $timeRecordToday = TimeRecord::where('student_id', Auth::id())
      ->where('date', now()->toDateString())
      ->first();

    if (!$timeRecordToday || !$timeRecordToday->time_in) {
      return $this->redirectWithError('student.time-records.time-in', 'You must clock in first.');
    }

    return Inertia::render('student/time-records/time-out');
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

      return redirect()->route('student.time-records.index')->with([
        'toast' => true,
        'type' => 'success',
        'message' => 'Time in recorded successfully.'
      ]);
    } catch (ValidationException $e) {
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => $e->getMessage()
      ])->withErrors($e->errors());
    } catch (\Exception $e) {
      Log::error('Time in error: ' . $e->getMessage(), [
        'user_id' => Auth::id(),
        'trace' => $e->getTraceAsString(),
        'file' => $request->file('image') ? [
          'name' => $request->file('image')->getClientOriginalName(),
          'size' => $request->file('image')->getSize(),
          'mime' => $request->file('image')->getMimeType()
        ] : null,
        'storage_disk' => $this->storageDisk,
        'storage_path' => self::STORAGE_PATH
      ]);
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => 'Failed to record time in: ' . $e->getMessage()
      ]);
    }
  }

  public function timeOut(Request $request): RedirectResponse
  {
    try {
      $this->validateTimeRecordImage($request);
      $today = now()->toDateString();

      $record = $this->getTodayTimeRecord($today);
      if (!$record) {
        throw ValidationException::withMessages([
          'time_out' => 'No time in record found for today.'
        ]);
      }

      if (!$record->time_in) {
        throw ValidationException::withMessages([
          'time_out' => 'You must clock in first.'
        ]);
      }

      if ($record->time_out) {
        throw ValidationException::withMessages([
          'time_out' => 'You have already clocked out today.'
        ]);
      }

      $imagePath = $this->storeTimeRecordImage($request->file('image'));
      $hoursWorked = $this->calculateHoursWorked($record->time_in);

      $record->update([
        'time_out' => now(),
        'time_out_image' => $imagePath,
        'rendered_hours' => $hoursWorked
      ]);

      $student = Auth::user()->student;
      $student->completed_hours = round(($student->completed_hours ?? 0) + $hoursWorked);
      $student->save();

      return redirect()->route('student.time-records.index')->with([
        'toast' => true,
        'type' => 'success',
        'message' => 'Time out recorded successfully.'
      ]);
    } catch (ValidationException $e) {
      Log::warning('Time out validation error: ' . $e->getMessage(), [
        'user_id' => Auth::id(),
        'errors' => $e->errors()
      ]);
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => $e->getMessage()
      ])->withErrors($e->errors());
    } catch (\Exception $e) {
      Log::error('Time out error: ' . $e->getMessage(), [
        'user_id' => Auth::id(),
        'trace' => $e->getTraceAsString(),
        'file' => $request->file('image') ? [
          'name' => $request->file('image')->getClientOriginalName(),
          'size' => $request->file('image')->getSize(),
          'mime' => $request->file('image')->getMimeType()
        ] : null
      ]);
      return back()->with([
        'toast' => true,
        'type' => 'error',
        'message' => 'Failed to record time out: ' . $e->getMessage()
      ]);
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
    if ($this->storageDisk === 'public') {
      $path = Storage::disk('public')->putFile(self::STORAGE_PATH, $file, ['visibility' => 'public']);
    } else {
      $path = $file->store(self::STORAGE_PATH, ['disk' => 'public', 'visibility' => 'public']);
    }

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

    $student->completed_hours = round(($student->completed_hours ?? 0) + $hoursWorked);
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
    return to_route('student.time-records.index')->with([
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
