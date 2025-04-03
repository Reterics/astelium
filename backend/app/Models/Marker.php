<?php

namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marker extends Model
{
    use HasFactory;

    protected $fillable = [
        'map_id',
        'name',
        'icon_type',
        'description',
        'image',
        'gps',
        'tags',
        'private',
        'created_by',
        'account_id'
    ];

    protected $casts = [
        'gps' => 'array',
        'tags' => 'array',
        'private' => 'boolean',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function map()
    {
        return $this->belongsTo(Map::class);
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
