<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
        'private',
        'created_by',
        'related_project_id',
        'related_task_id',
        'related_client_id',
        'account_id'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function markers()
    {
        return $this->hasMany(Marker::class);
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
