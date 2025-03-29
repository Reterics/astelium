<?php

namespace App\Http\Controllers;

use App\Models\Storage;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Storage::with('warehouses')->get());
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
            'warehouses' => 'nullable|array',
            'warehouses.*' => 'exists:warehouses,id'
        ]);

        $storage = Storage::create($validated);

        // Attach warehouses
        $storage->warehouses()->sync($validated['warehouses']);

        return response()->json($storage->load('warehouses'));
    }

    public function update(Request $request, Storage $storage): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'sku' => 'sometimes|required|unique:storages,sku,' . $storage->id,
            'name' => 'sometimes|required',
            'description' => 'nullable|string',
            'threshold' => 'sometimes|required|integer',
            'storage_amount' => 'sometimes|required|integer',
            'value' => 'sometimes|required|numeric',
            'warehouses' => 'nullable|array',
            'warehouses.*' => 'exists:warehouses,id'
        ]);

        $storage->update($validated);

        if (isset($validated['warehouses'])) {
            $storage->warehouses()->sync($validated['warehouses']);
        }

        return response()->json($storage->load('warehouses'));
    }

    public function destroy(Storage $storage): \Illuminate\Http\JsonResponse
    {
        $storage->delete();
        return response()->json(['message' => 'Storage deleted successfully']);
    }
}
