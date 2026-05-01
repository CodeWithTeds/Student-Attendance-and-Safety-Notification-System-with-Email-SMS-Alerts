<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class AttendanceNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $guardian,
        public User $student,
        public string $status,
        public string $time
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Attendance Notification: {$this->student->name} is {$this->status}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.attendance-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
