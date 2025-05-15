<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Coordinator\AnnouncementController;
use App\Http\Controllers\Student\AnnouncementController as StudentAnnouncementController;
use App\Http\Controllers\Coordinator\DashboardController as CoordinatorDashboardController;
use App\Http\Controllers\Coordinator\StudentController;
use App\Http\Controllers\Student\CompanySubmissionController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Models\Announcements;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Student\TimeRecordController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/force-logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('force-logout');



/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //Resource Routes
    Route::resource('departments', DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('programs', ProgramController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('users', UserController::class)->only(['index', 'update']);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/student.php';
require __DIR__ . '/coordinator.php';
