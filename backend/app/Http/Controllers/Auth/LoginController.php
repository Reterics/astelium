<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request): \Illuminate\Http\RedirectResponse
    {
        Log::debug('Login attempt with data:', $request->all());

        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            Log::info('Login successful for user: ' . $request->input('email'));

            $request->session()->regenerate();

            // Redirect based on user role
            $user = Auth::user();
            if ($user->isClient()) {
                return redirect()->intended('/appointments');
            } else {
                return redirect()->intended('/admin/dashboard');
            }
        }
        Log::warning('Login failed for user: ' . $request->input('email'));


        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
