<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory;
use Illuminate\Http\Request;

class TransactionCategoryController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(TransactionCategory::all());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        return response()->json(TransactionCategory::create($validated), 201);
    }

    public function show(TransactionCategory $transactionCategory): \Illuminate\Http\JsonResponse
    {
        return response()->json($transactionCategory);
    }

    public function update(Request $request, TransactionCategory $transactionCategory): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        $transactionCategory->update($validated);
        return response()->json($transactionCategory);
    }

    public function destroy(TransactionCategory $transactionCategory): \Illuminate\Http\JsonResponse
    {
        $transactionCategory->delete();
        return response()->json(['message' => 'Transaction category deleted successfully']);
    }
}
