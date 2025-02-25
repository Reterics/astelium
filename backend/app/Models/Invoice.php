<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'supplierName', 'supplierTaxNumber', 'supplierAddress',
        'customerName', 'customerTaxNumber', 'customerAddress',
        'invoiceNumber', 'invoiceCategory', 'invoiceIssueDate',
        'invoiceDeliveryDate', 'invoicePaymentDate', 'invoiceCurrency',
        'invoiceExchangeRate', 'invoicePaymentMethod', 'invoiceAppearance',
        'invoiceGrossAmount', 'transactionID', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    protected static function booted()
    {
        static::creating(function ($invoice) {
            if (auth()->check()) {
                $invoice->account_id = auth()->user()->account_id;
            }
        });
        static::addGlobalScope(new AccountScope);
    }
}
