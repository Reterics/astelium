<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class InvoiceUserResource extends JsonResource
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

        // If the user is an admin or belongs to the account that owns this invoice user, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'supplier_name' => $this->supplier_name,
                'supplier_tax_number' => $this->supplier_tax_number,
                'supplier_post_code' => $this->supplier_post_code,
                'supplier_town' => $this->supplier_town,
                'supplier_street_name' => $this->supplier_street_name,
                'supplier_street_category' => $this->supplier_street_category,
                'supplier_address' => $this->supplier_address,
                'supplier_country' => $this->supplier_country,
                'supplier_bank_account_number' => $this->supplier_bank_account_number,
                'login' => $this->login,
                // Password, sign_key, and exchange_key are hidden in the model
                'created_by' => $this->created_by,
                'modified_by' => $this->modified_by,
                'account_id' => $this->account_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'account' => $this->when($this->relationLoaded('account'), new AccountResource($this->account)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'supplier_name' => $this->supplier_name,
            'supplier_country' => $this->supplier_country,
        ];
    }
}
