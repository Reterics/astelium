<?php


use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractTemplateController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceUserController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WarehouseController;
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
    Route::apiResource('/api/projects', ProjectController::class);

    Route::apiResource('/api/tasks', TaskController::class);

    Route::apiResource('/api/clients', ClientController::class);

    Route::get('/api/reports', [ReportController::class, 'index']);

    Route::get('/api/settings', [SettingsController::class, 'index']);
    Route::put('/api/settings', [SettingsController::class, 'update']);


    Route::apiResource('/api/transactions', TransactionController::class);

    Route::apiResource('/api/notes', NoteController::class);

    // Inventory
    Route::apiResource('/api/storage', StorageController::class);
    Route::apiResource('/api/warehouses', WarehouseController::class);
    Route::apiResource('/api/domains', DomainController::class);

    // Management
    Route::apiResource('/api/invoice-users', InvoiceUserController::class);
    Route::apiResource('/api/invoices', InvoiceController::class);
    Route::apiResource('/api/contract-templates', ContractTemplateController::class);
    Route::apiResource('/api/contracts', ContractController::class);
});


Route::post('/admin/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('admin.logout');
