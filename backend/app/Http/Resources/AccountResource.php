<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class AccountResource extends JsonResource
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

        // If the user is an admin or belongs to this account, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->id)) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'admin_user_id' => $this->admin_user_id,
                'subscription_plan' => $this->subscription_plan,
                'subscription_status' => $this->subscription_status,
                'billing_cycle' => $this->billing_cycle,
                'trial_ends_at' => $this->trial_ends_at,
                'subscription_expires_at' => $this->subscription_expires_at,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'admin' => $this->when($this->relationLoaded('admin'), new UserResource($this->admin)),
                'users' => $this->when($this->relationLoaded('users'), UserResource::collection($this->users)),
                'projects' => $this->when($this->relationLoaded('projects'), ProjectResource::collection($this->projects)),
                'settings' => $this->when($this->relationLoaded('setting'), SettingResource::collection($this->setting)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
