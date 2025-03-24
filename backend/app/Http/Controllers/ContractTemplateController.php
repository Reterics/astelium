<?php
namespace App\Http\Controllers;

use App\Models\ContractTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ContractTemplateController extends Controller
{
    /**
     * Fetch all contract templates
     */
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        return ContractTemplate::all();
    }

    /**
     * Store a new contract template
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt',
            'content' => 'nullable|string',
        ]);
        $fields = $request->input('fields');

        if (is_array($fields)) {
            $validated['fields'] = json_encode($fields);
        } else if (is_string($fields)) {
            $validated['fields'] = $fields;
        }

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('contract-templates', 'public'); // Store in storage/app/public/contract-templates
            $validated['path'] = $path;
        }

        return ContractTemplate::create($validated);
    }

    /**
     * Show a specific contract template
     */
    public function show(ContractTemplate $contractTemplate): ContractTemplate
    {
        return $contractTemplate;
    }

    /**
     * Update a contract template
     */
    public function update(Request $request, ContractTemplate $contractTemplate): ContractTemplate
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt',
            'content' => 'nullable|string',
        ]);

        // Handle file upload if a new file is provided
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($contractTemplate->path) {
                Storage::disk('public')->delete($contractTemplate->path);
            }

            $file = $request->file('file');
            $path = $file->store('contract-templates', 'public');
            $validated['path'] = $path;
        }

        $contractTemplate->update($validated);
        return $contractTemplate;
    }

    /**
     * Delete a contract template
     */
    public function destroy(ContractTemplate $contractTemplate): \Illuminate\Http\JsonResponse
    {
        if ($contractTemplate->path) {
            Storage::disk('public')->delete($contractTemplate->path);
        }

        $contractTemplate->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
