<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'is_admin' => 'sometimes|boolean',
        ]);

        if (!Auth::check() || !Auth::user()->is_admin) {
            $data['is_admin'] = false;
        }

        $user = new User();
        $user->password = Hash::make($data['password']);
        $user->email = $data['email'];
        $user->name = $data['name'];
        $user->is_admin = $data['is_admin'];
        $user->save();
        Log::debug('User created');

        return response()->json($user, 201);
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
            'is_admin' => 'sometimes|boolean',
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
