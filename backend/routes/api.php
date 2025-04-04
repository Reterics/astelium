<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractTemplateController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceUserController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MarkerController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\Api\ApiLoginController;
use App\Http\Middleware\EnsureAccountAccess;
use App\Http\Middleware\EnsureUserRole;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


Route::middleware(['auth:sanctum', EnsureAccountAccess::class])->group(function () {
    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/move-before', [TaskController::class, 'moveBefore']);


    Route::apiResource('clients', ClientController::class);

    Route::get('reports', [ReportController::class, 'index']);


    Route::apiResource('transactions', TransactionController::class);

    Route::apiResource('notes', NoteController::class);

    // Inventory
    Route::apiResource('storage', StorageController::class);
    Route::apiResource('warehouses', WarehouseController::class);
    Route::apiResource('domains', DomainController::class);

    // Management
    Route::apiResource('invoice-users', InvoiceUserController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('contract-templates', ContractTemplateController::class);
    Route::apiResource('contracts', ContractController::class);

    Route::get('/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::get('/maps', [MapController::class, 'index']);
    Route::post('/maps', [MapController::class, 'store']);
    Route::put('/maps/{map}', [MapController::class, 'update']);
    Route::delete('/maps/{map}', [MapController::class, 'destroy']);

    Route::get('/maps/{map}/markers', [MarkerController::class, 'index']);
    Route::post('/maps/{map}/markers', [MarkerController::class, 'store']);
    Route::put('/markers/{marker}', [MarkerController::class, 'update']);
    Route::delete('/markers/{marker}', [MarkerController::class, 'destroy']);


    Route::apiResource('users', UserController::class);
});

Route::middleware(['auth:sanctum', EnsureAccountAccess::class, EnsureUserRole::class . ':admin'])->group(function () {
    Route::get('settings', [SettingsController::class, 'index']);
    Route::put('settings', [SettingsController::class, 'update']);
});

Route::apiResource('appointments', AppointmentController::class);


Route::post('/login', [ApiLoginController::class, 'login']);
Route::middleware(['auth:sanctum', EnsureAccountAccess::class])->post('/logout', [ApiLoginController::class, 'logout']);

Route::middleware('auth:sanctum')->post('/user/avatar', [UserController::class, 'updateAvatar']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/chat', [ChatController::class, 'index']);
    Route::post('/chat', [ChatController::class, 'store']);
});

Route::post('/register', [RegisterController::class, 'register']);

Route::middleware('auth:sanctum')->get('/account', [AccountController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/address-autocomplete', function (\Illuminate\Http\Request $request) {
        $query = $request->input('q');
        Log::info('Address autocomplete query', ['query' => $query]);
        if (!$query) {
            return response()->json([]);
        }

        $response = Http::withHeaders([
            'User-Agent' => 'AsteliumApp/1.0 (attila@reterics.com)',
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $query,
            'format' => 'json',
            'addressdetails' => 1,
            'limit' => 5,
        ]);

        Log::info('Nominatim API response', ['response' => $response->json()]);

        return $response->json();
    });

});

