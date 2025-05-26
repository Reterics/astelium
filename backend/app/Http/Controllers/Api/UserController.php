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
            'role' => 'required|in:admin,member,viewer,client', // Allow only specific roles
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'workingSchedule' => 'nullable|json',
            'bio' => 'nullable|string',
            'title' => 'nullable|string'
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
            'workingSchedule' => $request->workingSchedule,
            'bio' => $request->bio,
            'title' => $request->title
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
     * Get a specific user.
     * GET /api/users/{user}
     */
    public function show(User $user): \Illuminate\Http\JsonResponse
    {
        // Add any additional user data or relationships you need
        return response()->json($user);
    }

    /**
     * Get public information for a specific user.
     * GET /api/public/users/{user}
     */
    public function publicShow(User $user): \Illuminate\Http\JsonResponse
    {
        // Return only the public information
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role,
            'bio' => $user->bio,
            'workingSchedule' => $user->workingSchedule,
            'image' => $user->image,
            'title' => $user->title
        ]);
    }

    /**
     * Update an existing user.
     * PUT /api/users/{user}
     */
    public function update(Request $request, User $user): \Illuminate\Http\JsonResponse
    {
        Log::debug('Update user attempt with data:', $request->all());

        $validator = Validator::make($request->all(), [
            'name'     => 'sometimes|required|string|max:255',
            'email'    => "sometimes|required|email|max:255|unique:users,email,{$user->id}",
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|required|in:admin,member,viewer,client', // Allow only specific roles
            'image' => 'nullable|string|max:2048',
            'workingSchedule' => 'nullable|json',
            'bio' => 'nullable|string',
            'title' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

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

    /**
     * Update user avatar.
     * POST /user/avatar
     */
    public function updateAvatar(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        $path = $request->file('image')->store('users', 'public');
        $user->image = $path;
        $user->save();

        return response()->json($user, 200);
    }
}
