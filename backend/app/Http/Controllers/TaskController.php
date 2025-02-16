<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'type' => 'nullable|string|in:feature,task,issue',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'start_time' => 'nullable|date',
            'expected_time' => 'nullable|integer',
            'priority' => 'required|in:low,medium,high',
            'story_points' => 'nullable|integer',
        ]);

        $validated['type'] = $validated['type'] ?? 'task';
        $validated['order_index'] = Task::max('order_index') + 1;

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
            'type' => 'nullable|string|in:feature,task,issue',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'start_time' => 'nullable|date',
            'expected_time' => 'nullable|integer',
            'priority' => 'sometimes|in:low,medium,high',
            'story_points' => 'nullable|integer',
        ]);

        $validated['type'] = $validated['type'] ?? 'task';

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Task $task): \Illuminate\Http\JsonResponse
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function moveBefore(Request $request, Task $task)
    {
        $validated = $request->validate([
            'before_task_id' => 'nullable|exists:tasks,id',
        ]);

        DB::transaction(function () use ($task, $validated) {
            if ($validated['before_task_id']) {
                $beforeTask = Task::find($validated['before_task_id']);
                $newOrderIndex = $beforeTask->order_index;

                // Shift tasks down to make space
                Task::where('order_index', '>=', $newOrderIndex)
                    ->increment('order_index');

                // Set new order index
                $task->update(['order_index' => $newOrderIndex]);
            } else {
                // Move to the end
                $task->update(['order_index' => Task::max('order_index') + 1]);
            }
        });

        return response()->json(['success' => true, 'task' => $task]);
    }

}
