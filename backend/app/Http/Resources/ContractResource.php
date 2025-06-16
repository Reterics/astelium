<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ContractResource extends JsonResource
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

        // If the user is an admin or belongs to the account that owns this contract, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'created' => $this->created,
                'template_id' => $this->template_id,
                'data' => $this->data,
                'account_id' => $this->account_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'template' => $this->when($this->relationLoaded('template'), new ContractTemplateResource($this->template)),
                'account' => $this->when($this->relationLoaded('account'), new AccountResource($this->account)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created' => $this->created,
        ];
    }
}
