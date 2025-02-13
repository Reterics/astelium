<?php

namespace App\Http\Controllers;

use App\Models\Storage;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Storage::all());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'sku' => 'required|unique:storages,sku',
            'name' => 'required',
            'description' => 'nullable|string',
            'threshold' => 'required|integer',
            'storage_amount' => 'required|integer',
            'value' => 'required|numeric',
            'warehouse_id' => 'nullable|exists:warehouses,id',
        ]);

        return response()->json(Storage::create($validated), 201);
    }

    public function update(Request $request, Storage $storage): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'sku' => 'required|unique:storages,sku,' . $storage->id,
            'name' => 'required',
            'description' => 'nullable|string',
            'threshold' => 'required|integer',
            'storage_amount' => 'required|integer',
            'value' => 'required|numeric',
            'warehouse_id' => 'nullable|exists:warehouses,id',
        ]);

        $storage->update($validated);
        return response()->json($storage);
    }

    public function destroy(Storage $storage): \Illuminate\Http\JsonResponse
    {
        $storage->delete();
        return response()->json(['message' => 'Storage deleted successfully']);
    }
}
