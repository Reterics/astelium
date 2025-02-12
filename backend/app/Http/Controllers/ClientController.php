<?php
namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        return Client::all();
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'tax_number' => 'nullable|string|max:50',
            'post_code' => 'nullable|string|max:10',
            'town' => 'nullable|string|max:100',
            'street_name' => 'nullable|string|max:255',
            'street_category' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'type' => 'required|in:PERSON,COMPANY_HU,COMPANY_EU,COMPANY',
            'vat_status' => 'required|in:PRIVATE_PERSON,DOMESTIC,OTHER',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
        ]);

        return Client::create($validatedData);
    }

    public function show(Client $client): Client
    {
        return $client;
    }

    public function update(Request $request, Client $client): Client
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'tax_number' => 'nullable|string|max:50',
            'post_code' => 'nullable|string|max:10',
            'town' => 'nullable|string|max:100',
            'street_name' => 'nullable|string|max:255',
            'street_category' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:50',
            'bank_account_number' => 'nullable|string|max:50',
            'type' => 'sometimes|required|in:PERSON,COMPANY_HU,COMPANY_EU,COMPANY',
            'vat_status' => 'sometimes|required|in:PRIVATE_PERSON,DOMESTIC,OTHER',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
        ]);

        $client->update($validatedData);
        return $client;
    }

    public function destroy(Client $client): \Illuminate\Http\JsonResponse
    {
        $client->delete();
        return response()->json(['message' => 'Client deleted successfully']);
    }
}
