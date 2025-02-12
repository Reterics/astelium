<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'supplierName', 'supplierTaxNumber', 'supplierAddress',
        'customerName', 'customerTaxNumber', 'customerAddress',
        'invoiceNumber', 'invoiceCategory', 'invoiceIssueDate',
        'invoiceDeliveryDate', 'invoicePaymentDate', 'invoiceCurrency',
        'invoiceExchangeRate', 'invoicePaymentMethod', 'invoiceAppearance',
        'invoiceGrossAmount', 'transactionID'
    ];

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
