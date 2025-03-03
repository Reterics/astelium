<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request['password']),
            'account_id' => $user->account_id,
            'role' => $request->role,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('users', 'public');
            $data['image'] = $path;
        }

        $newUser = User::create($data);

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }

            $path = $request->file('image')->store('users', 'public');

            $data['image'] = $path;
        }

        $user->update($data);

        return response()->json($user, 200);
    }
}
