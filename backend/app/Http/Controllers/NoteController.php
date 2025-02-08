<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Note::all());
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_task_id' => 'nullable|exists:tasks,id',
            'related_client_id' => 'nullable|exists:clients,id',
        ]);

        return response()->json(Note::create($validated), 201);
    }

    public function update(Request $request, Note $note): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'related_project_id' => 'nullable|exists:projects,id',
            'related_task_id' => 'nullable|exists:tasks,id',
            'related_client_id' => 'nullable|exists:clients,id',
        ]);

        $note->update($validated);
        return response()->json($note);
    }

    public function destroy(Note $note): \Illuminate\Http\JsonResponse
    {
        $note->delete();
        return response()->json(['message' => 'Note deleted successfully']);
    }
}
