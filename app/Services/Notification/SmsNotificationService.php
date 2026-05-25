<?php

namespace App\Services\Notification;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsNotificationService
{
    protected string $apiKey;

    protected string $deviceId;

    protected string $baseUrl = 'https://api.textbee.dev/api/v1/gateway/devices';

    public function __construct()
    {
        $this->apiKey = config('services.textbee.api_key', '');
        $this->deviceId = config('services.textbee.device_id', '');
    }

    public function send(string $phoneNumber, string $message): bool
    {
        if (empty($this->apiKey) || empty($this->deviceId)) {
            Log::warning('TextBee SMS not configured. Missing API key or Device ID.', [
                'phone_number' => $phoneNumber,
            ]);

            return false;
        }

        $recipient = $this->formatPhoneNumber($phoneNumber);

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
            ])->post("{$this->baseUrl}/{$this->deviceId}/send-sms", [
                'recipients' => [$recipient],
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info('SMS sent successfully via TextBee.', [
                    'phone_number' => $recipient,
                    'response' => $response->json(),
                ]);

                return true;
            }

            Log::error('TextBee SMS delivery failed.', [
                'phone_number' => $recipient,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return false;
        } catch (\Throwable $exception) {
            Log::error('TextBee SMS exception.', [
                'phone_number' => $recipient,
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Format phone number to E.164 format.
     * Handles Philippine numbers (prefix +63) if no country code is present.
     */
    protected function formatPhoneNumber(string $phoneNumber): string
    {
        $cleaned = preg_replace('/[^0-9+]/', '', $phoneNumber);

        // Already in E.164 format
        if (str_starts_with($cleaned, '+')) {
            return $cleaned;
        }

        // Philippine number starting with 0 (e.g., 09171234567)
        if (str_starts_with($cleaned, '0') && strlen($cleaned) === 11) {
            return '+63' . substr($cleaned, 1);
        }

        // Philippine number without leading 0 (e.g., 9171234567)
        if (strlen($cleaned) === 10 && str_starts_with($cleaned, '9')) {
            return '+63' . $cleaned;
        }

        // Fallback: prepend + if it looks like a full international number
        return '+' . $cleaned;
    }
}
