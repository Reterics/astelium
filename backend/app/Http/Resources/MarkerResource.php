<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class MarkerResource extends JsonResource
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

        // If the user is an admin or belongs to the account that owns this marker, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'map_id' => $this->map_id,
                'name' => $this->name,
                'icon_type' => $this->icon_type,
                'description' => $this->description,
                'image' => $this->image,
                'gps' => $this->gps,
                'tags' => $this->tags,
                'private' => $this->private,
                'created_by' => $this->created_by,
                'account_id' => $this->account_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'account' => $this->when($this->relationLoaded('account'), new AccountResource($this->account)),
                'map' => $this->when($this->relationLoaded('map'), new MapResource($this->map)),
            ];
        }

        // For other authenticated users, return limited information if the marker is not private
        if (!$this->private) {
            return [
                'id' => $this->id,
                'map_id' => $this->map_id,
                'name' => $this->name,
                'icon_type' => $this->icon_type,
                'description' => $this->description,
                'image' => $this->image,
                'gps' => $this->gps,
                'tags' => $this->tags,
            ];
        }

        // For private markers, return no information to users who don't own the marker
        return [];
    }
}
