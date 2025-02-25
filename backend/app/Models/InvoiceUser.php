<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_name',
        'supplier_tax_number',
        'supplier_post_code',
        'supplier_town',
        'supplier_street_name',
        'supplier_street_category',
        'supplier_address',
        'supplier_country',
        'supplier_bank_account_number',
        'login',
        'password',
        'sign_key',
        'exchange_key',
        'created_by',
        'modified_by', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    protected $hidden = [
        'password',
        'sign_key',
        'exchange_key'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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
