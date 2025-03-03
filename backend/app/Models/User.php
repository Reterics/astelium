<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Scopes\AccountScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'account_id',
        'role',
        'image'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
        ];
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOwner()
    {
        return $this->id === $this->account->admin_user_id;
    }

    public function setRoleAttribute($value)
    {
        if (auth()->check() && auth()->user()->isAdmin()) {
            $this->attributes['role'] = $value;
        }
    }

    public function getImageAttribute($value)
    {
        return $value
            ? asset('storage/' . $value)
            : null;
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
