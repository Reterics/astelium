<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Transaction::with('categories');

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_client_id' => 'nullable|exists:clients,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:transaction_categories,id',
        ]);

        $transaction = Transaction::create($validated);
        if (isset($validated['categories'])) {
            $transaction->categories()->sync($validated['categories']);
        }

        return response()->json($transaction->load('categories'), 201);
    }

    public function show(Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        return response()->json($transaction->load('categories'));
    }

    public function update(Request $request, Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:income,expense,transfer',
            'amount' => 'sometimes|numeric',
            'date' => 'sometimes|date',
            'description' => 'nullable|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_client_id' => 'nullable|exists:clients,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:transaction_categories,id',
        ]);

        $transaction->update($validated);
        if (isset($validated['categories'])) {
            $transaction->categories()->sync($validated['categories']);
        }
        $transaction->categories()->sync($validated['categories']);

        return response()->json($transaction->load('categories'));
    }

    public function destroy(Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        $transaction->categories()->detach();
        $transaction->delete();
        return response()->json(['message' => 'Transaction deleted successfully']);
    }
}
