<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'amount', 'date', 'description', 'related_project_id', 'related_client_id', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Get the categories that belong to this transaction.
     */
    public function categories()
    {
        return $this->belongsToMany(TransactionCategory::class, 'category_transaction', 'transaction_id', 'transaction_category_id');
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
