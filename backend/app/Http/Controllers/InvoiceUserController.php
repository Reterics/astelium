<?php
namespace App\Http\Controllers;

use App\Models\InvoiceUser;
use Illuminate\Http\Request;

class InvoiceUserController extends Controller
{
    public function index() {
        return InvoiceUser::all();
    }

    public function store(Request $request) {
        return InvoiceUser::create($request->all());
    }

    public function show(InvoiceUser $invoiceUser) {
        return $invoiceUser;
    }

    public function update(Request $request, InvoiceUser $invoiceUser) {
        $invoiceUser->update($request->all());
        return $invoiceUser;
    }

    public function destroy(InvoiceUser $invoiceUser) {
        $invoiceUser->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
