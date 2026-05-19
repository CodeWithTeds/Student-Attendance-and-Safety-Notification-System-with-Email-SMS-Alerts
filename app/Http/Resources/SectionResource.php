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
            'grade_level_id' => $this->grade_level_id,
            'name' => $this->name,
            'school_year' => $this->school_year,
            'capacity' => $this->capacity,
            'students_count' => $this->students_count ?? 0,
            'grade_level' => $this->whenLoaded('gradeLevel', fn () => $this->gradeLevel ? (new GradeLevelResource($this->gradeLevel))->resolve($request) : null),
            'adviser' => $this->whenLoaded('adviser', fn () => $this->adviser ? (new AdviserResource($this->adviser))->resolve($request) : null),
            'schedule' => $this->whenLoaded('schedule', fn () => $this->schedule ? (new SectionScheduleResource($this->schedule))->resolve($request) : null),
            'students' => UserResource::collection($this->whenLoaded('students')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
