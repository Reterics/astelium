<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class TaskResource extends JsonResource
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

        // If the user is an admin or the task is associated with the user's account, return all fields
        if ($user && ($user->isAdmin() || $user->account_id === $this->account_id)) {
            return [
                'id' => $this->id,
                'title' => $this->title,
                'description' => $this->description,
                'status' => $this->status,
                'priority' => $this->priority,
                'due_date' => $this->due_date,
                'completed_at' => $this->completed_at,
                'project_id' => $this->project_id,
                'assigned_to_user_id' => $this->assigned_to_user_id,
                'created_by_user_id' => $this->created_by_user_id,
                'account_id' => $this->account_id,
                'order' => $this->order,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'project' => $this->when($this->relationLoaded('project'), new ProjectResource($this->project)),
                'assigned_to' => $this->when($this->relationLoaded('assignedTo'), new UserResource($this->assignedTo)),
                'created_by' => $this->when($this->relationLoaded('createdBy'), new UserResource($this->createdBy)),
            ];
        }

        // For other authenticated users, return limited information
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'due_date' => $this->due_date,
            'completed_at' => $this->completed_at,
        ];
    }
}
