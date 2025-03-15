<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Account;

class AccountController extends Controller
{
    /**
     * Get the current authenticated user's account details.
     */
    public function show(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $account = $user->account;

        if (!$account) {
            return response()->json(['error' => 'No associated account found'], 404);
        }

        return response()->json([
            'account' => $account,
            'user_role' => $user->role,
        ], 200);
    }
}
