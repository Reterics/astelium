<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MapController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Map::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'private' => 'nullable|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_task_id' => 'nullable|exists:tasks,id',
            'related_client_id' => 'nullable|exists:clients,id',
        ]);

        $validated['created_by'] = $request->user()->id;
        if (isset($validated['private'])) {
            $validated['private'] = $validated['private'] === 'true';
        }
        return Map::create($validated);
    }

    public function update(Request $request, Map $map)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'private' => 'nullable|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_task_id' => 'nullable|exists:tasks,id',
            'related_client_id' => 'nullable|exists:clients,id',
        ]);
        if (isset($validated['private'])) {
            $validated['private'] = $validated['private'] === 'true';
        }

        $map->update($validated);

        return $map;
    }

    public function destroy(Request $request, Map $map)
    {
        $map->delete();

        return response()->json(['message' => 'Map deleted']);
    }
}
