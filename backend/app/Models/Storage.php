<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;

    protected $fillable = ['sku', 'name', 'description', 'threshold', 'storage_amount', 'value'];


    public function warehouses() {
        return $this->belongsToMany(Warehouse::class, 'storage_warehouse');
    }
}
