<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location', 'description'];

    public function storages() {
        return $this->belongsToMany(Storage::class, 'storage_warehouse');
    }
}
