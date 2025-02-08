<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Transaction::all());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:income,outgoing',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_client_id' => 'nullable|exists:clients,id',
        ]);

        return response()->json(Transaction::create($validated), 201);
    }

    public function update(Request $request, Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:income,outgoing',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_client_id' => 'nullable|exists:clients,id',
        ]);

        $transaction->update($validated);
        return response()->json($transaction);
    }

    public function destroy(Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        $transaction->delete();
        return response()->json(['message' => 'Transaction deleted successfully']);
    }
}
