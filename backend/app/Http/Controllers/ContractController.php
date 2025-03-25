<?php
namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        return Contract::with('template')->get();
    }

    public function store(Request $request) {
        $data = $request->all();

        if (!isset($data['created'])) {
            $data['created'] = now()->toDateString();
        }

        return Contract::create($data);
    }

    public function show(Contract $contract): Contract
    {
        return $contract->load('template');
    }

    public function update(Request $request, Contract $contract): Contract
    {
        $contract->update($request->all());
        return $contract->load('template');
    }

    public function destroy(Contract $contract): \Illuminate\Http\JsonResponse
    {
        $contract->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
