<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'guardian_phone' => $this->guardian_phone,
            'notification_sms_enabled' => (bool) $this->notification_sms_enabled,
            'notification_email_enabled' => (bool) $this->notification_email_enabled,
            'role' => $this->role?->value ?? $this->role,
            'status' => $this->status?->value ?? $this->status,
            'student_id' => $this->student_id,
            'student_number' => $this->student_number,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'suffix' => $this->suffix,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,
            'place_of_birth' => $this->place_of_birth,
            'nationality' => $this->nationality,
            'house_no' => $this->house_no,
            'street' => $this->street,
            'barangay' => $this->barangay,
            'city' => $this->city,
            'province' => $this->province,
            'zip_code' => $this->zip_code,
            'qr_code_value' => $this->qr_code_value,
            'qr_code_svg' => $this->qr_code_svg,
            'qr_code_fingerprint' => $this->qr_code_value ? substr(hash('sha256', $this->qr_code_value), 0, 10) : null,
            'qr_code_updated_at_display' => $this->qr_code_value ? $this->updated_at?->timezone(config('app.timezone'))->format('M d, Y h:i A') : null,
            'children' => UserResource::collection($this->whenLoaded('children')),
            'parents' => UserResource::collection($this->whenLoaded('parents')),
            'sections' => SectionResource::collection($this->whenLoaded('sections')),
            'grade_level' => $this->whenLoaded('gradeLevel', fn () => $this->gradeLevel ? (new GradeLevelResource($this->gradeLevel))->resolve($request) : null),
            'current_section' => $this->whenLoaded('sections', fn () => $this->sections->first() ? (new SectionResource($this->sections->first()))->resolve($request) : null),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
