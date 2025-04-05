<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'status', 'type', 'project_id', 'assigned_to',
        'start_time', 'expected_time', 'priority', 'story_points', 'order_index', 'account_id', 'address'];

    protected $casts = [
        'gps' => 'array',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function project(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedUser(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public static function getTaskTypes()
    {
        return ['feature', 'task', 'issue'];
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
