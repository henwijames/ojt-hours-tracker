<?php

use App\Http\Controllers\Student\AnnouncementController;
use App\Http\Controllers\Student\CompanySubmissionController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\TimeRecordController;
use App\Models\Announcements;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

  Route::controller(CompanySubmissionController::class)->prefix('company')->name('company.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store');
    Route::get('/edit', 'edit')->name('edit');
    Route::put('/{companySubmission}', 'update')->name('update');
  });

  Route::controller(AnnouncementController::class)->prefix('announcements')->name('announcements.')->group(function () {
    Route::get('/', 'index')->name('index');
  });

  Route::get('/reminders', function () {
    $reminders = Announcements::where('program_id', Auth::user()->student->program_id)
      ->where('type', 'reminder')
      ->with(['department', 'program'])
      ->latest()
      ->paginate(5);
    return Inertia::render('student/reminders', [
      'reminders' => $reminders,
    ]);
  })->name('reminders');

  Route::controller(TimeRecordController::class)->prefix('time-records')->name('time-records.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/time-in', 'timeIn')->name('time-in');
    Route::post('/time-out', 'timeOut')->name('time-out');
  });
});
