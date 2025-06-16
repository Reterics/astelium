<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class InvoiceItemResource extends JsonResource
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

        // If the user is an admin or the invoice item is associated with the user's account, return all fields
        if ($user && ($user->isAdmin() || $this->invoice && $user->account_id === $this->invoice->account_id)) {
            return [
                'id' => $this->id,
                'invoice_id' => $this->invoice_id,
                'description' => $this->description,
                'quantity' => $this->quantity,
                'unit_price' => $this->unit_price,
                'amount' => $this->amount,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'description' => $this->description,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'amount' => $this->amount,
        ];
    }
}
