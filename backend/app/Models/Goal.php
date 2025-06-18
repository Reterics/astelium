<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'target_amount', 'start_date', 'due_date', 'account_id', 'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'target_amount' => 'decimal:2',
    ];

    /**
     * Get the transaction categories associated with this goal.
     */
    public function transactionCategories()
    {
        return $this->belongsToMany(TransactionCategory::class, 'goal_transaction_category', 'goal_id', 'transaction_category_id');
    }

    /**
     * Get the account that owns the goal.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Boot the model.
     */
    protected static function booted()
    {
        static::creating(function ($goal) {
            if (auth()->check()) {
                $goal->account_id = auth()->user()->account_id;
            }
        });
        static::addGlobalScope(new AccountScope);
    }
}
