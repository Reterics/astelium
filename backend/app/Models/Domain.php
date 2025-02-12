<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    protected $fillable = ['url', 'description', 'admin_url', 'credentials'];
}
