<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Log;

class EnsureAccountAccess
{
    public function handle(Request $request, Closure $next)
    {
        Log::info("Middleware EnsureAccountAccess is executing.");

        try {
            $user = $request->user();

            if (!$user) {
                Log::error("User not authenticated.");
                return response()->json(['error' => 'Unauthorized: No user'], 401);
            }

            if (!$user->account) {
                Log::error("User has no associated account.", ['user_id' => $user->id]);
                return response()->json(['error' => 'Unauthorized: No account linked'], 401);
            }

            if ($user->account->subscription_status !== 'active') {
                Log::error("User account is inactive.", ['account_id' => $user->account->id]);
                return response()->json(['error' => 'Unauthorized: Subscription inactive'], 401);
            }

            Log::info("User authorized.", ['user_id' => $user->id, 'account_id' => $user->account_id]);

            $request->attributes->set('account_id', $user->account_id);

            return $next($request);
        } catch (\Throwable $e) {
            Log::error("Middleware Exception: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
