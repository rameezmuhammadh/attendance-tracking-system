<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentGroupController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('/subjects', SubjectController::class);
    Route::resource('/departments', DepartmentController::class);
    Route::resource('/users', UserController::class);
    Route::resource('/student-groups', StudentGroupController::class);
    Route::resource('/students', StudentController::class);
    Route::resource('/attendances', AttendanceController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
