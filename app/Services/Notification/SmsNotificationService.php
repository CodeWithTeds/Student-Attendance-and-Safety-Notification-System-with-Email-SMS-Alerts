<?php

namespace App\Services\Notification;

use Illuminate\Support\Facades\Log;

class SmsNotificationService
{
    public function send(string $phoneNumber, string $message): bool
    {
        Log::info('SMS notification queued for delivery.', [
            'phone_number' => $phoneNumber,
            'message' => $message,
            'driver' => config('services.sms.driver', 'log'),
        ]);

        return true;
    }
}
