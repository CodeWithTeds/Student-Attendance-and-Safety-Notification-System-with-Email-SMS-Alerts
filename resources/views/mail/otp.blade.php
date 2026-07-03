<x-mail::message>
# Attendance Verification Code

Hello! Here is your one-time verification code to view attendance records for **{{ $studentName }}**:

<x-mail::panel>
<div style="text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
{{ $code }}
</div>
</x-mail::panel>

This code will expire in **10 minutes**. Do not share this code with anyone.

If you did not request this code, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
