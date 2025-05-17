<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;


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
