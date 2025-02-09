<?php


use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TransactionController;
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


Route::middleware([App\Http\Middleware\AdminMiddleware::class])->group(function () {
    // Projects
    Route::get('/api/projects', [ProjectController::class, 'index']);
    Route::post('/api/projects', [ProjectController::class, 'store']);
    Route::put('/api/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/api/projects/{project}', [ProjectController::class, 'destroy']);

    // Tasks
    Route::get('/api/tasks', [TaskController::class, 'index']);
    Route::post('/api/tasks', [TaskController::class, 'store']);
    Route::put('/api/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/api/tasks/{task}', [TaskController::class, 'destroy']);

    // Clients
    Route::get('/api/clients', [ClientController::class, 'index']);
    Route::post('/api/clients', [ClientController::class, 'store']);
    Route::put('/api/clients/{client}', [ClientController::class, 'update']);
    Route::delete('/api/clients/{client}', [ClientController::class, 'destroy']);

    // Reports
    Route::get('/api/reports', [ReportController::class, 'index']);

    // Settings
    Route::get('/api/settings', [SettingsController::class, 'index']);
    Route::put('/api/settings', [SettingsController::class, 'update']);

    // Storage
    Route::get('/api/storage', [StorageController::class, 'index']);
    Route::post('/api/storage', [StorageController::class, 'store']);
    Route::put('/api/storage/{storage}', [StorageController::class, 'update']);
    Route::delete('/api/storage/{storage}', [StorageController::class, 'destroy']);

    // Transactions
    Route::get('/api/transactions', [TransactionController::class, 'index']);
    Route::post('/api/transactions', [TransactionController::class, 'store']);
    Route::put('/api/transactions/{transactions}', [TransactionController::class, 'update']);
    Route::delete('/api/transactions/{transactions}', [TransactionController::class, 'destroy']);

    // Notes
    Route::get('/api/notes', [NoteController::class, 'index']);
    Route::post('/api/notes', [NoteController::class, 'store']);
    Route::put('/api/notes/{notes}', [NoteController::class, 'update']);
    Route::delete('/api/notes/{notes}', [NoteController::class, 'destroy']);
});


Route::post('/admin/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('admin.logout');
