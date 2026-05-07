<?php

namespace App\Http\Requests\ClassSection;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::ADMIN;
    }

    public function rules(): array
    {
        return [
            'time_in' => ['required', 'date_format:H:i'],
            'time_out' => ['required', 'date_format:H:i', 'after:time_in'],
        ];
    }

    public function scheduleData(): array
    {
        return $this->validated();
    }
}
