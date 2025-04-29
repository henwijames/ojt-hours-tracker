<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Coordinator\DashboardController as CoordinatorDashboardController;
use App\Mail\TestMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/force-logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
});

Route::get('/coordinator/dashboard', [CoordinatorDashboardController::class, 'index'])->name('coordinator.dashboard');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/admin/departments', [DepartmentController::class, 'index'])->name('admin.departments.index');
    Route::post('/admin/departments', [DepartmentController::class, 'store'])->name('admin.departments.store');
    Route::put('/admin/departments/{department}', [DepartmentController::class, 'update'])->name('admin.departments.update');
    Route::delete('/admin/departments/{department}', [DepartmentController::class, 'destroy'])->name('admin.departments.destroy');

    Route::get('/admin/programs', [ProgramController::class, 'index'])->name('admin.programs.index');
    Route::post('/admin/programs', [ProgramController::class, 'store'])->name('admin.programs.store');
    Route::put('/admin/programs/{program}', [ProgramController::class, 'update'])->name('admin.programs.update');
    Route::delete('/admin/programs/{program}', [ProgramController::class, 'destroy'])->name('admin.programs.destroy');

    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::put('/admin/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
