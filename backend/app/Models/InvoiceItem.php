<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id', 'lineNatureIndicator', 'productCodeCategory',
        'productCodeValue', 'quantity', 'unitOfMeasure', 'unitPrice',
        'lineNetAmountData', 'lineVatRate', 'lineVatData', 'lineGrossAmountData',
        'lineDescription', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
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
