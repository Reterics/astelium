<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class AppointmentResource extends JsonResource
{
    public function toArray($request): array
    {
        $user = Auth::guard('sanctum')->user();

        if ($user) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,
                'comments' => $this->comments,
                'day' => $this->day,
                'time' => $this->time,
                'length' => $this->length,
            ];
        }

        return [
            'id' => $this->id,
            'day' => $this->day,
            'time' => $this->time,
            'length' => $this->length,
        ];
    }
}
