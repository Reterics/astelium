<?php


use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// API routes should be defined in api.php

// Authentication endpoints that need to be handled by the backend
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');
Route::post('/users', [UserController::class, 'store']);

// Admin SPA: This single route loads the admin application.
// The {any?} catch-all pattern will let client-side routing work within the SPA.
Route::get('/admin/{any?}', [AdminController::class, 'index'])
    ->where('any', '.*')
    ->name('admin');

// Catch-all route for the SPA
// This must be the last route to ensure it doesn't override any specific routes
Route::get('/', [HomeController::class, 'spa'])->name('spa');
Route::get('/appointments', [HomeController::class, 'appointments'])->name('appointments');
Route::get('/register', [HomeController::class, 'spa'])->name('register');
Route::get('/login', [HomeController::class, 'spa'])->name('login');
