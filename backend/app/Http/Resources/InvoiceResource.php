<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class InvoiceResource extends JsonResource
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

        // If the user is an admin or the invoice is associated with the user's account, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'invoice_number' => $this->invoice_number,
                'client_id' => $this->client_id,
                'project_id' => $this->project_id,
                'issue_date' => $this->issue_date,
                'due_date' => $this->due_date,
                'status' => $this->status,
                'subtotal' => $this->subtotal,
                'tax' => $this->tax,
                'total' => $this->total,
                'notes' => $this->notes,
                'account_id' => $this->account_id,
                'created_by_user_id' => $this->created_by_user_id,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'client' => $this->when($this->relationLoaded('client'), new ClientResource($this->client)),
                'project' => $this->when($this->relationLoaded('project'), new ProjectResource($this->project)),
                'items' => $this->when($this->relationLoaded('items'), InvoiceItemResource::collection($this->items)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'issue_date' => $this->issue_date,
            'due_date' => $this->due_date,
            'status' => $this->status,
            'total' => $this->total,
        ];
    }
}
