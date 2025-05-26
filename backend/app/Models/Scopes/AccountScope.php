<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use App\Models\Account;

class AccountScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (auth()->check()) {
            // For authenticated users, filter by their account_id
            $builder->where(function($query) {
                $query->where('account_id', auth()->user()->account_id)
                      ->orWhereNull('account_id'); // Also include records with null account_id (guest appointments)
            });
        }
    }
}
