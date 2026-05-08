<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $announcement->title }}</title>
    <style>
        body { margin: 0; padding: 0; background: #f8fafc; color: #0f172a; font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 640px; margin: 32px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .header { padding: 28px 32px; background: #1d4ed8; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { padding: 32px; }
        .message { white-space: pre-line; color: #334155; }
        .footer { padding: 20px 32px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 13px; background: #f8fafc; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $announcement->title }}</h1>
        </div>
        <div class="content">
            <p>Hello, {{ $guardian->name }}.</p>
            <div class="message">{{ $announcement->message }}</div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Student Attendance and Safety Notification System.
        </div>
    </div>
</body>
</html>
