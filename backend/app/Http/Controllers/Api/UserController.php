<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * List all users.
     * GET /api/users
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(User::all());
    }

    /**
     * Create a new user.
     * POST /api/users
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        Log::debug('Register attempt with data:', $request->all());

        $user = auth()->user();

        // Only allow the admin to create users
        if (!$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }


        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,member,viewer', // Allow only specific roles
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request['password']),
            'account_id' => $user->account_id,
            'role' => $request->role,
        ]);

        Log::debug('User created');

        return response()->json($newUser, 201);
    }

    /**
     * Update an existing user.
     * PUT /api/users/{user}
     */
    public function update(Request $request, User $user): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => "sometimes|required|email|max:255|unique:users,email,{$user->id}",
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'required|in:admin,member,viewer', // Allow only specific roles
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user, 200);
    }
}
