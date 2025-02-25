<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = ['name', 'created', 'template_id', 'data', 'account_id'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function template()
    {
        return $this->belongsTo(ContractTemplate::class);
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
