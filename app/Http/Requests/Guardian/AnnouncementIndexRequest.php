<?php

namespace App\Http\Requests\Guardian;

use App\Enums\AnnouncementDeliveryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnnouncementIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notification_search' => ['nullable', 'string', 'max:120'],
            'channel' => ['nullable', Rule::in(['sms', 'email'])],
            'delivery_status' => ['nullable', Rule::enum(AnnouncementDeliveryStatus::class)],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ];
    }

    public function filters(): array
    {
        $validated = $this->validated();

        return [
            'notification_search' => $validated['notification_search'] ?? null,
            'channel' => $validated['channel'] ?? null,
            'delivery_status' => $validated['delivery_status'] ?? null,
            'date_from' => $validated['date_from'] ?? null,
            'date_to' => $validated['date_to'] ?? null,
        ];
    }
}
