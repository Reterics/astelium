<?php
namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index() {
        return Invoice::with('items')->get();
    }

    public function store(Request $request) {
        $invoiceData = $request->except('items');
        $items = $request->input('items', []);

        $invoice = Invoice::create($invoiceData);

        foreach ($items as $item) {
            $item['invoice_id'] = $invoice->id;
            InvoiceItem::create($item);
        }

        return Invoice::with('items')->find($invoice->id);
    }

    public function show(Invoice $invoice) {
        return $invoice->load('items');
    }

    public function update(Request $request, Invoice $invoice) {
        $invoice->update($request->except('items'));

        $items = $request->input('items', []);
        InvoiceItem::where('invoice_id', $invoice->id)->delete();

        foreach ($items as $item) {
            $item['invoice_id'] = $invoice->id;
            InvoiceItem::create($item);
        }

        return Invoice::with('items')->find($invoice->id);
    }

    public function destroy(Invoice $invoice): \Illuminate\Http\JsonResponse
    {
        $invoice->items()->delete();
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted']);
    }
}
