<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;

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
        'company', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    protected $casts = [
        'type' => 'string',
        'vat_status' => 'string',
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
