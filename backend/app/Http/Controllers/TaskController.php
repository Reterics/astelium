<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $perPage = $request->query('per_page', 10); // Default to 10 per page
        return Task::with(['project', 'assignedUser'])->paginate($perPage);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:open,in-progress,review,completed,closed',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'start_time' => 'nullable|date',
            'expected_time' => 'nullable|integer',
            'priority' => 'required|in:low,medium,high',
            'story_points' => 'nullable|integer',
        ]);

        return response()->json(Task::create($validated), 201);
    }

    public function show(Task $task): \Illuminate\Http\JsonResponse
    {
        return response()->json($task->load(['project', 'assignedUser']));
    }

    public function update(Request $request, Task $task): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:open,in-progress,review,completed,closed',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'start_time' => 'nullable|date',
            'expected_time' => 'nullable|integer',
            'priority' => 'sometimes|in:low,medium,high',
            'story_points' => 'nullable|integer',
        ]);

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Task $task): \Illuminate\Http\JsonResponse
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
