<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'school_year' => $this->school_year,
            'capacity' => $this->capacity,
            'students_count' => $this->students_count ?? 0,
            'grade_level' => new GradeLevelResource($this->whenLoaded('gradeLevel')),
            'adviser' => new AdviserResource($this->whenLoaded('adviser')),
            'schedule' => new SectionScheduleResource($this->whenLoaded('schedule')),
            'students' => UserResource::collection($this->whenLoaded('students')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
