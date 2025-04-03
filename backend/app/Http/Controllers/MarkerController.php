<?php

namespace App\Http\Controllers;

use App\Models\Marker;
use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MarkerController extends Controller
{
    public function index(Request $request, Map $map)
    {
        return Marker::where('map_id', $map->id)->get();
    }

    public function store(Request $request, Map $map)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon_type' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'gps' => 'required|array',
            'gps.lat' => 'required|numeric',
            'gps.lng' => 'required|numeric',
            'tags' => 'nullable|array',
            'private' => 'boolean',
        ]);

        $validated['map_id'] = $map->id;
        $validated['created_by'] = $request->user()->id;

        return Marker::create($validated);
    }

    public function update(Request $request, Marker $marker)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon_type' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'gps' => 'sometimes|required|array',
            'gps.lat' => 'required_with:gps|numeric',
            'gps.lng' => 'required_with:gps|numeric',
            'tags' => 'nullable|array',
            'private' => 'boolean',
        ]);

        $marker->update($validated);

        return $marker;
    }

    public function destroy(Request $request, Marker $marker)
    {
        $marker->delete();

        return response()->json(['message' => 'Marker deleted']);
    }
}
