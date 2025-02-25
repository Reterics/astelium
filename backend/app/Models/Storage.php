<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;

    protected $fillable = ['sku', 'name', 'description', 'threshold', 'storage_amount', 'value', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function warehouses() {
        return $this->belongsToMany(Warehouse::class, 'storage_warehouse');
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
