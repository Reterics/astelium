<?php
namespace App\Models;

use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'comments', 'day', 'time', 'timezone', 'length', 'account_id',
        'status', 'service_type', 'location', 'recurrence', 'user_id', 'assigned_to', 'created_by_user_id',
        'reminder_sent', 'reminder_48h_sent', 'reminder_24h_sent', 'reminder_1h_sent'];

    protected $casts = [
        'recurrence' => 'array',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    protected static function booted()
    {
        static::creating(function ($appointment) {
            // Only set account_id from authenticated user if it's not already set
            // and there's no user_id to copy it from
            if (auth()->check() && !$appointment->account_id && !$appointment->user_id) {
                $appointment->account_id = auth()->user()->account_id;
            }

            // If created_by_user_id is not set and user is authenticated, set it
            if (auth()->check() && !$appointment->created_by_user_id) {
                $appointment->created_by_user_id = auth()->id();
            }
        });
        static::addGlobalScope(new AccountScope);
    }

    /**
     * Scope a query to only include appointments for the current user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForCurrentUser($query)
    {
        if (auth()->check()) {
            return $query->where('user_id', auth()->id());
        }
        return $query;
    }
}
