<?php

use App\Http\Controllers\Coordinator\DashboardController;
use App\Http\Controllers\Coordinator\StudentController;
use App\Http\Controllers\Coordinator\AnnouncementController;
use App\Http\Controllers\Coordinator\CompanySubmissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:coordinator'])->prefix('coordinator')->name('coordinator.')->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

  Route::resource('students', StudentController::class)->only(['index', 'update']);
  Route::post('students/required-hours', [StudentController::class, 'updateRequiredHours'])->name('students.required-hours');
  Route::resource('announcements', AnnouncementController::class)->only(['index', 'store', 'update', 'destroy']);

  Route::controller(CompanySubmissionController::class)
    ->prefix('company-submissions')
    ->name('company-submissions.')
    ->group(function () {
      Route::get('/', 'index')->name('index');
      Route::put('/{companySubmission}/approve', 'approve')->name('approve');
      Route::put('/{companySubmission}/reject', 'reject')->name('reject');
    });
});
