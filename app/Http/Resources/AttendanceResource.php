<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'subject_id' => $this->subject_id,
            'date' => $this->date,
            'is_present' => $this->is_present,
            'remarks' => $this->remarks,
            'subject' => new SubjectResource($this->whenLoaded('subject')),
            'student' => new StudentResource($this->whenLoaded('student')),
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d H:i'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d H:i'),
        ];
    }
}
