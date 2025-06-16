<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        $user = Auth::guard('sanctum')->user();

        // If the user is an admin or viewing their own profile, return all fields
        if ($user && ($user->isAdmin() || $user->id === $this->id)) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'role' => $this->role,
                'account_id' => $this->account_id,
                'image' => $this->image,
                'workingSchedule' => $this->workingSchedule,
                'bio' => $this->bio,
                'title' => $this->title,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ];
        }

        // For other authenticated users, return limited information
        if ($user) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'role' => $this->role,
                'image' => $this->image,
                'bio' => $this->bio,
                'title' => $this->title,
            ];
        }

        // For unauthenticated users, return only public information
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'bio' => $this->bio,
            'image' => $this->image,
            'title' => $this->title,
        ];
    }
}
