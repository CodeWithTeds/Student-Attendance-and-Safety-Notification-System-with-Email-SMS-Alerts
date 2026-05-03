# Project Memory: SASN-web-2026

## Project Overview
SASN (Student Attendance System with Notifications) is a modern web application designed for managing student attendance, generating QR-based IDs, and notifying parents/guardians.

## Tech Stack
- **Backend**: Laravel 11+
- **Frontend**: React 18+ with TypeScript (Inertia.js)
- **Styling**: Vanilla CSS + Tailwind CSS (Variable-based theme)
- **Database**: MySQL
- **Mail**: Gmail SMTP (`teadmarvin@gmail.com`) for system notifications.

---

## 🚀 Recent Task: Attendance Notifications & Guardian CRUD
**Objective**: Implement automated and manual attendance notifications via email with a modern, integrated design.

### 🏛️ Backend Implementation (Adherence to `codingstandard.md`)
- **Layered Architecture**:
    - **Controllers**: `ParentGuardianController` updated with `notify` method.
    - **Mailables**: Created `AttendanceNotification` mailable using a modern HTML/Blade template.
- **Email Design**:
    - Developed a premium, modern HTML template with responsive status cards (Present/Absent).

### 🎨 Frontend Implementation (Adherence to `react_frontend_coding_standard_2026.md`)
- **Integrated Notifications**:
    - **Trigger**: The "Email" badge in the **Notifications** column is now a clickable button that triggers the attendance notification.
    - **Visual Feedback**: Hover effects (`bg-blue-200`) and scaling animations (`active:scale-95`) provide a premium feel.
    - **Disabled State**: The button is automatically disabled and styled as slate/opaque if the guardian has email notifications turned off.
- **Action Column Cleanliness**: Removed redundant email buttons from the Actions column to keep the UI focused and professional.

### ✅ Task Status: Completed
- [x] Database Migrations (Notification fields)
- [x] SMTP Configuration (Gmail)
- [x] Attendance Notification Mailable & Blade Template
- [x] Frontend Integrated "Email Badge" Trigger
- [x] Responsive Design & Standard Compliance
