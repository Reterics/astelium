<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractTemplateController;
use App\Http\Controllers\DomainController;
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
use App\Http\Controllers\Api\ApiLoginController;


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/move-before', [TaskController::class, 'moveBefore']);


    Route::apiResource('clients', ClientController::class);

    Route::get('reports', [ReportController::class, 'index']);

    Route::get('settings', [SettingsController::class, 'index']);
    Route::put('settings', [SettingsController::class, 'update']);


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
});

Route::apiResource('appointments', AppointmentController::class);


Route::post('/login', [ApiLoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [ApiLoginController::class, 'logout']);
