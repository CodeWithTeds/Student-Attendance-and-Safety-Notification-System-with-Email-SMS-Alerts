<?php

namespace App\Enums;

enum NotificationEventType: string
{
    case ATTENDANCE = 'attendance';
    case ABSENCE = 'absence';
    case LATE = 'late';
    case ANNOUNCEMENT = 'announcement';

    public function label(): string
    {
        return match ($this) {
            self::ATTENDANCE => 'Attendance',
            self::ABSENCE => 'Absence',
            self::LATE => 'Late',
            self::ANNOUNCEMENT => 'Announcement',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::ATTENDANCE => 'Sent when a student checks in or checks out.',
            self::ABSENCE => 'Sent when a student is marked absent.',
            self::LATE => 'Sent when a student arrives after the class time in.',
            self::ANNOUNCEMENT => 'Sent when announcements are broadcast to guardians.',
        };
    }

    public function defaultTitle(): string
    {
        return match ($this) {
            self::ATTENDANCE => 'Attendance update',
            self::ABSENCE => 'Absence alert',
            self::LATE => 'Late arrival alert',
            self::ANNOUNCEMENT => 'School announcement',
        };
    }

    public function defaultMessageTemplate(): string
    {
        return match ($this) {
            self::ATTENDANCE => '{student_name} {attendance_status} at {event_time}.',
            self::ABSENCE => '{student_name} was marked absent for {class_date}.',
            self::LATE => '{student_name} arrived late at {event_time}. Scheduled time in is {time_in}.',
            self::ANNOUNCEMENT => '{announcement_title}: {announcement_message}',
        };
    }
}
