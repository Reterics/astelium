<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Account;
use Inertia\Inertia;

class RegisterController extends Controller
{

    public function showRegistrationForm(): \Inertia\Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle user registration and account creation.
     */
    public function register(Request $request)
    {
        if (!$request->expectsJson()) {
            return response()->json(['error' => 'Invalid Request'], 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'company' => 'required|string|max:255',
            'subscription_plan' => 'in:free,premium',
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
        ]);

        $account = Account::create([
            'name' => $validated['company'],
            'admin_user_id' => $admin->id,
            'subscription_plan' => $validated['subscription_plan'],
            'subscription_status' => 'active',
        ]);

        $admin->update(['account_id' => $account->id]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $admin,
            'account' => $account,
        ], 201);
    }
}
