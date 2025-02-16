<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'status', 'type', 'project_id', 'assigned_to',
        'start_time', 'expected_time', 'priority', 'story_points', 'order_index'
    ];

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
}
