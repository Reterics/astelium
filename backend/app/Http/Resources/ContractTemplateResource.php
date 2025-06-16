<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ContractTemplateResource extends JsonResource
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

        // If the user is an admin or belongs to the account that owns this template, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'path' => $this->path,
                'content' => $this->content,
                'fields' => $this->fields,
                'account_id' => $this->account_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'account' => $this->when($this->relationLoaded('account'), new AccountResource($this->account)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
