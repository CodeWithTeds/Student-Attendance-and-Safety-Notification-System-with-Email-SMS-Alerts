<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Notification</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #1e293b;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }
        .header {
            background-color: #4f46e5;
            padding: 32px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #0f172a;
        }
        .message {
            margin-bottom: 32px;
            color: #475569;
        }
        .status-card {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            border: 1px solid #e2e8f0;
        }
        .status-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .status-row:last-child {
            margin-bottom: 0;
        }
        .label {
            font-weight: 600;
            color: #64748b;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .value {
            font-weight: 700;
            color: #1e293b;
            font-size: 15px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .status-present {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-absent {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .footer {
            padding: 24px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 13px;
            color: #94a3b8;
        }
        .btn {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SASN Attendance</h1>
        </div>
        <div class="content">
            <div class="greeting">Hello, {{ $guardian->name }}</div>
            <p class="message">
                This is an automated notification regarding your child's attendance at school today.
            </p>
            
            <div class="status-card">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td class="label" style="padding-bottom: 8px;">Student</td>
                        <td class="value" style="padding-bottom: 8px; text-align: right;">{{ $student->name }}</td>
                    </tr>
                    <tr>
                        <td class="label" style="padding-bottom: 8px;">Status</td>
                        <td style="padding-bottom: 8px; text-align: right;">
                            <span class="status-badge {{ strtolower($status) === 'present' ? 'status-present' : 'status-absent' }}">
                                {{ $status }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Time Recorded</td>
                        <td class="value" style="text-align: right;">{{ $time }}</td>
                    </tr>
                </table>
            </div>

            <p class="message" style="margin-bottom: 0;">
                If you have any questions, please contact the school office. Thank you for your continued support.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Student Attendance and Safety Notification System. All rights reserved.
        </div>
    </div>
</body>
</html>
