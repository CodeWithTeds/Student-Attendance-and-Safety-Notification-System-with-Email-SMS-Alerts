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

## Recent Task: Class / Section Management
**Date**: 2026-05-03  
**Objective**: Add admin-only management for grade levels, sections, advisers, and student section assignment while following the existing `/admin/students` CRUD design and avoiding a service layer for this feature per request.

### Backend Implementation
- Added additive database tables:
    - `grade_levels`
    - `advisers`
    - `sections`
    - `section_student`
- Added models:
    - `App\Models\GradeLevel`
    - `App\Models\Adviser`
    - `App\Models\Section`
- Added admin controller:
    - `App\Http\Controllers\Admin\ClassSectionController`
- Added FormRequests under `app/Http/Requests/ClassSection` for grade level, adviser, section, and student assignment validation.
- Added API Resources:
    - `GradeLevelResource`
    - `AdviserResource`
    - `SectionResource`
- Extended `UserResource` and `User` model relationship support for section assignment data.
- Registered admin-only routes under `/admin`:
    - `/admin/class-sections`
    - `/admin/grade-levels`
    - `/admin/advisers`
    - `/admin/sections`
    - `/admin/sections/{section}/students`

### Frontend Implementation
- Added Inertia page:
    - `resources/js/pages/admin/class-sections/index.tsx`
- Added feature components under `resources/js/features/class-sections`:
    - Toolbar
    - Section table
    - Grade level modal
    - Adviser modal
    - Section modal
    - Assign students modal
    - Grade level / adviser registry panel
- Updated sidebar navigation so **Class / Section** links to `/admin/class-sections`.
- Matched the existing admin Students CRUD visual pattern: bordered page shell, compact toolbar, scrollable table, icon actions, modal forms, and CSV export.

### Verification Notes
- `php artisan migrate` was run successfully; new tables were created locally.
- `npm run build` passed.
- `php artisan route:list --path=admin` confirmed the new admin routes.
- `npm run types:check` is blocked by pre-existing unrelated TypeScript errors in guardian/register files.
- `php artisan test` has one pre-existing unrelated failure in `Tests\Feature\Auth\RegistrationTest` where the user is not authenticated after registration.

### Task Status: Completed
- [x] Grade level CRUD
- [x] Adviser CRUD
- [x] Section CRUD
- [x] Student section assignment and removal
- [x] Admin sidebar route wiring
- [x] Build verification

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
