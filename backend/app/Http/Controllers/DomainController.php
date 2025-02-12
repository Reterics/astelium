<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use Illuminate\Http\Request;

class DomainController extends Controller
{
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        return Domain::all();
    }

    public function store(Request $request)
    {
        return Domain::create($request->all());
    }

    public function show(Domain $domain): Domain
    {
        return $domain;
    }

    public function update(Request $request, Domain $domain): Domain
    {
        $domain->update($request->all());
        return $domain;
    }

    public function destroy(Domain $domain): \Illuminate\Http\JsonResponse
    {
        $domain->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
