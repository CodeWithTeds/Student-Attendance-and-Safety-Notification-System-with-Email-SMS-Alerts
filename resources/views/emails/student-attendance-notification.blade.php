<x-mail::message>
# Attendance Notification

Hello {{ $attendanceLog->student->parents->first()->name ?? 'Parent/Guardian' }},

This is an automated notification from the school attendance system.

**Student:** {{ $attendanceLog->student->name }}  
**Event:** {{ $attendanceLog->event_type?->pastTenseLabel() }}  
**Time:** {{ $attendanceLog->scanned_at->timezone(config('app.timezone'))->format('M d, Y h:i A') }}  
**Status:** {{ $scheduleStatus }}  

@if($scheduleStatus === 'Late')
<x-mail::panel>
Your child arrived late based on their registered section schedule.
</x-mail::panel>
@endif

Thank you,<br>
{{ config('app.name') }}
</x-mail::message>
