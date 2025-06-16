<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class MapResource extends JsonResource
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

        // If the user is an admin or belongs to the account that owns this map, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'image' => $this->image,
                'private' => $this->private,
                'created_by' => $this->created_by,
                'related_project_id' => $this->related_project_id,
                'related_task_id' => $this->related_task_id,
                'related_client_id' => $this->related_client_id,
                'account_id' => $this->account_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'account' => $this->when($this->relationLoaded('account'), new AccountResource($this->account)),
                'markers' => $this->when($this->relationLoaded('markers'), MarkerResource::collection($this->markers)),
            ];
        }

        // For other authenticated users, return limited information if the map is not private
        if (!$this->private) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'image' => $this->image,
            ];
        }

        // For private maps, return no information to users who don't own the map
        return [];
    }
}
