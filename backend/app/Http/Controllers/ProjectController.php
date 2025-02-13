<?php
namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Project::with('client')->get());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        Log::info("Validate incoming project");

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:active,completed,on-hold',
                'client_id' => 'nullable|exists:clients,id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        Log::info("Create validated project:" . json_encode($validated));

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    public function update(Request $request, Project $project): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:active,completed,on-hold',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
