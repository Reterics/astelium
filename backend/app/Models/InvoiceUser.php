<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceUser extends Model
{
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
        'modified_by'
    ];

    protected $hidden = [
        'password',
        'sign_key',
        'exchange_key'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
