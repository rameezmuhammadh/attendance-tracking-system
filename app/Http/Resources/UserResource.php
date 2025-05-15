<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department', function () {
                return new DepartmentResource($this->department);
            }),
            'email_verified_at' => $this->email_verified_at ? (new Carbon($this->email_verified_at))->format('Y-m-d H:i') : null,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d H:i'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d H:i'),
        ];
    }
}
