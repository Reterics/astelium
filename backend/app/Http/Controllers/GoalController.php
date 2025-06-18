<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Goal::with('transactionCategories')->get());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_amount' => 'required|numeric',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:active,paused,completed',
            'transaction_categories' => 'nullable|array',
            'transaction_categories.*' => 'exists:transaction_categories,id',
        ]);

        $goal = Goal::create($validated);
        if (isset($validated['transaction_categories'])) {
            $goal->transactionCategories()->sync($validated['transaction_categories']);
        }

        return response()->json($goal->load('transactionCategories'), 201);
    }

    public function show(Goal $goal): \Illuminate\Http\JsonResponse
    {
        return response()->json($goal->load('transactionCategories'));
    }

    public function update(Request $request, Goal $goal): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'target_amount' => 'sometimes|numeric',
            'start_date' => 'sometimes|date',
            'due_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|in:active,paused,completed',
            'transaction_categories' => 'nullable|array',
            'transaction_categories.*' => 'exists:transaction_categories,id',
        ]);

        $goal->update($validated);
        if (isset($validated['transaction_categories'])) {
            $goal->transactionCategories()->sync($validated['transaction_categories']);
        }

        return response()->json($goal->load('transactionCategories'));
    }

    public function destroy(Goal $goal): \Illuminate\Http\JsonResponse
    {
        $goal->transactionCategories()->detach();
        $goal->delete();
        return response()->json(['message' => 'Goal deleted successfully']);
    }
}
