<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ProjectResource extends JsonResource
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

        // If the user is an admin or the project is associated with the user's account, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'status' => $this->status,
                'start_date' => $this->start_date,
                'end_date' => $this->end_date,
                'client_id' => $this->client_id,
                'account_id' => $this->account_id,
                'created_by_user_id' => $this->created_by_user_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'client' => $this->when($this->relationLoaded('client'), new ClientResource($this->client)),
                'tasks' => $this->when($this->relationLoaded('tasks'), TaskResource::collection($this->tasks)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
        ];
    }
}
