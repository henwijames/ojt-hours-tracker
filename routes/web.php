<?php

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

    Route::get('/admin/departments', function () {
        return Inertia::render('admin/departments');
    })->name('departments');

    Route::get('/admin/programs', function () {
        return Inertia::render('admin/programs');
    })->name('programs');

    Route::get('/admin/users', function () {
        return Inertia::render('admin/users');
    })->name('users');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
