<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'color', 'icon', 'account_id'
    ];

    /**
     * Get the transactions that belong to this category.
     */
    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'category_transaction', 'transaction_category_id', 'transaction_id');
    }

    /**
     * Get the account that owns the category.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Get the goals associated with this category.
     */
    public function goals()
    {
        return $this->belongsToMany(Goal::class, 'goal_transaction_category', 'transaction_category_id', 'goal_id');
    }

    /**
     * Boot the model.
     */
    protected static function booted()
    {
        static::creating(function ($category) {
            if (auth()->check()) {
                $category->account_id = auth()->user()->account_id;
            }
        });
        static::addGlobalScope(new AccountScope);
    }
}
