<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = ['name', 'created', 'template_id', 'data'];

    public function template()
    {
        return $this->belongsTo(ContractTemplate::class);
    }
}
