<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'registration_number' => $this->registration_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'is_first_year' => $this->is_first_year,
            'student_group_id' => $this->student_group_id,
            'department_id' => $this->department_id,
            'email' => $this->email,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'student_group' => new StudentGroupResource($this->whenLoaded('studentGroup')),
            'subjects' => SubjectResource::collection($this->whenLoaded('subjects')),
            'attendances' => AttendanceResource::collection($this->whenLoaded('attendances')),
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d H:i'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d H:i'),
        ];
    }
}
