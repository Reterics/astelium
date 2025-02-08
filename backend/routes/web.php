<?php


use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;

// Public index page
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');

// Registration routes
Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [UserController::class, 'store'])->name('store');

// Register endpoint:
Route::post('/users', [UserController::class, 'store']);

// Protected users endpoint
Route::middleware([App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/api/users', [UserController::class, 'index']);
    Route::put('/api/users/{user}', [UserController::class, 'update']);
});

// Admin SPA: This single route loads the admin application.
// The {any?} catch-all pattern will let client-side routing work within the SPA.
Route::middleware([App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/admin/{any?}', [AdminController::class, 'index'])
        ->where('any', '.*')
        ->name('admin');
});


Route::post('/admin/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');
