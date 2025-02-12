<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        return Warehouse::all();
    }

    public function store(Request $request)
    {
        return Warehouse::create($request->all());
    }

    public function show(Warehouse $warehouse): Warehouse
    {
        return $warehouse;
    }

    public function update(Request $request, Warehouse $warehouse): Warehouse
    {
        $warehouse->update($request->all());
        return $warehouse;
    }

    public function destroy(Warehouse $warehouse): \Illuminate\Http\JsonResponse
    {
        $warehouse->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
