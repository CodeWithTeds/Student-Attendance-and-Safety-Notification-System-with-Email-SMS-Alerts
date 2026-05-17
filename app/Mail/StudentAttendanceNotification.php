<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentAttendanceNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public string $scheduleStatus = 'On Time';

    public function __construct(
        public \App\Models\StudentAttendanceLog $attendanceLog
    ) {
        if ($this->attendanceLog->event_type?->value === 'check_in' && $this->attendanceLog->scanned_at && $this->attendanceLog->relationLoaded('student')) {
            $section = $this->attendanceLog->student->sections->first();
            if ($section && $section->relationLoaded('schedule') && $section->schedule) {
                $timeIn = $section->schedule->time_in;
                $scanTime = $this->attendanceLog->scanned_at->timezone(config('app.timezone'))->format('H:i:s');
                if ($scanTime > $timeIn) {
                    $this->scheduleStatus = 'Late';
                }
            }
        } elseif ($this->attendanceLog->event_type?->value === 'check_out') {
            $this->scheduleStatus = 'Completed';
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $status = $this->attendanceLog->event_type?->pastTenseLabel() ?? 'Recorded';
        return new Envelope(
            subject: "Attendance Alert: {$this->attendanceLog->student->name} - {$status}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.student-attendance-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
