<?php
namespace App\Http\Controllers;

use App\Models\ContractTemplate;
use Illuminate\Http\Request;

class ContractTemplateController extends Controller
{
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        return ContractTemplate::all();
    }

    public function store(Request $request) {
        return ContractTemplate::create($request->all());
    }

    public function show(ContractTemplate $contractTemplate): ContractTemplate
    {
        return $contractTemplate;
    }

    public function update(Request $request, ContractTemplate $contractTemplate): ContractTemplate
    {
        $contractTemplate->update($request->all());
        return $contractTemplate;
    }

    public function destroy(ContractTemplate $contractTemplate): \Illuminate\Http\JsonResponse
    {
        $contractTemplate->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
