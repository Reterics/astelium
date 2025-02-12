<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'name',
        'tax_number',
        'post_code',
        'town',
        'street_name',
        'street_category',
        'address',
        'country',
        'bank_account_number',
        'type',
        'vat_status',
        'email',
        'phone',
        'company'
    ];

    protected $casts = [
        'type' => 'string',
        'vat_status' => 'string',
    ];
}
