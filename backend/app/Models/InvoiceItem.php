<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id', 'lineNatureIndicator', 'productCodeCategory',
        'productCodeValue', 'quantity', 'unitOfMeasure', 'unitPrice',
        'lineNetAmountData', 'lineVatRate', 'lineVatData', 'lineGrossAmountData',
        'lineDescription'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
