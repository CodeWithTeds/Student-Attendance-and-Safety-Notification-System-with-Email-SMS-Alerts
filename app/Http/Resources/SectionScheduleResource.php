<?php

namespace App\Http\Resources;

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'section_id' => $this->section_id,
            'time_in' => $this->time_in,
            'time_out' => $this->time_out,
            'time_in_display' => $this->formatTime($this->time_in),
            'time_out_display' => $this->formatTime($this->time_out),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function formatTime(string $time): string
    {
        $format = strlen($time) === 5 ? 'H:i' : 'H:i:s';

        return CarbonImmutable::createFromFormat($format, $time)->format('h:i A');
    }
}
