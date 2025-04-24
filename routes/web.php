<?php

use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProgramController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard', [
            'user' => Auth::user(),
        ]);
    })->name('dashboard');

    Route::get('/admin/departments', [DepartmentController::class, 'index'])->name('admin.departments.index');
    Route::post('/admin/departments', [DepartmentController::class, 'store'])->name('admin.departments.store');

    Route::get('/admin/programs', [ProgramController::class, 'index'])->name('admin.programs.index');
    Route::post('/admin/programs', [ProgramController::class, 'store'])->name('admin.programs.store');
    Route::put('/admin/programs/{program}', [ProgramController::class, 'update'])->name('admin.programs.update');
    Route::delete('/admin/programs/{program}', [ProgramController::class, 'destroy'])->name('admin.programs.destroy');

    Route::get('/admin/users', function () {
        return Inertia::render('admin/users');
    })->name('users');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
