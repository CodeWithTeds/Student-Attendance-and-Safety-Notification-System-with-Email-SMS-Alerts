import type {
    AttendanceApiError,
    AttendanceApiResponse,
    AttendanceEventType,
    AttendanceLogResource,
} from '../types';

interface RecordAttendancePayload {
    qrCodeValue: string;
    eventType: AttendanceEventType | 'auto';
}

export async function recordQrAttendance({
    qrCodeValue,
    eventType,
}: RecordAttendancePayload): Promise<AttendanceLogResource> {
    const response = await fetch('/api/v1/qr-scanner/attendance', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            qr_code_value: qrCodeValue,
            event_type: eventType === 'auto' ? null : eventType,
        }),
    });

    const payload = (await response.json()) as AttendanceApiResponse | AttendanceApiError;

    if (!response.ok) {
        const errorPayload = payload as AttendanceApiError;
        const message =
            errorPayload.data?.qr_code_value?.[0] ??
            errorPayload.data?.event_type?.[0] ??
            errorPayload.errors?.qr_code_value?.[0] ??
            errorPayload.errors?.event_type?.[0] ??
            errorPayload.message ??
            'Unable to record attendance. Please try again.';

        throw new Error(message);
    }

    return (payload as AttendanceApiResponse).data;
}
