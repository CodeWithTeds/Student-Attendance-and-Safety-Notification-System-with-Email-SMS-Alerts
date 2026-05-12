<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category?->value ?? $this->category,
            'category_label' => $this->category?->label(),
            'action' => $this->action,
            'action_label' => Str::of($this->action)->replace(['.', '_'], ' ')->title()->value(),
            'description' => $this->description,
            'metadata' => $this->metadata ?? [],
            'ip_address' => $this->ip_address,
            'actor' => new UserResource($this->whenLoaded('actor')),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_display' => $this->created_at?->timezone(config('app.timezone'))->format('M d, Y h:i A'),
        ];
    }
}
