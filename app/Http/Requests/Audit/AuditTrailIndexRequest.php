<?php

namespace App\Http\Requests\Audit;

use App\Enums\AuditLogCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AuditTrailIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', Rule::enum(AuditLogCategory::class)],
            'date' => ['nullable', 'date'],
            'audit_page' => ['nullable', 'integer', 'min:1'],
            'attendance_page' => ['nullable', 'integer', 'min:1'],
            'notification_page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): array
    {
        return collect($this->validated())
            ->only(['search', 'category', 'date'])
            ->filter(fn ($value): bool => filled($value))
            ->all();
    }
}
