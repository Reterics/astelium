<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = ['name', 'location', 'description'];

    public function storages() {
        return $this->belongsToMany(Storage::class, 'storage_warehouse');
    }
}
