# Teacher Attendance Page Documentation

## 1️⃣ Page Overview

The Teacher Attendance Page enables class teachers to mark daily attendance for all students in their assigned class. It provides an intuitive interface with status bars for each student and supports bulk submission.

**Purpose**: Daily attendance marking interface for class teachers to record student presence, absence, and leave status.

**Target User Roles**: Teacher (Class Teachers only)

## 2️⃣ Route Information

- **Frontend Route**: `/teacher/attendance`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Teacher only (requires teacher authentication)

## 3️⃣ Completed Functionalities

- ✅ **Authentication check** - Redirects to login if not authenticated
- ✅ **Date selection** - Select attendance date (defaults to today)
- ✅ **Student list display** - Shows all students in teacher's class with:
  - Student name
  - Roll number
  - Attendance status selector
- ✅ **Attendance status marking** - Three status options:
  - PRESENT (green)
  - ABSENT (red)
  - LEAVE (yellow/amber)
- ✅ **Existing attendance loading** - Loads and displays previously marked attendance for selected date
- ✅ **Attendance update detection** - Differentiates between new and existing attendance
- ✅ **Bulk submission** - Submit attendance for all students at once
- ✅ **Loading states** - Shows loading indicator during data fetch and submission
- ✅ **Error handling** - Toast notifications for errors
- ✅ **Success feedback** - Toast notification on successful submission
- ✅ **Empty state handling** - Message when teacher is not assigned as class teacher

## 4️⃣ API Integrations

### GET `/api/teacher/class`

- **Purpose**: Fetches teacher's assigned class and student list
- **Triggered**: On page load
- **Response**: Returns class object with:
  - `id` - Class ID
  - `name` - Class name
  - `section` - Class section
  - `students` - Array of student objects (id, name, rollNo)

### GET `/api/attendance?classId={classId}&date={date}`

- **Purpose**: Fetches existing attendance records for the selected date
- **Triggered**: When date changes or on initial load
- **Query Parameters**:
  - `classId` - ID of the class
  - `date` - Selected date in ISO format (YYYY-MM-DD)
- **Response**: Returns attendance object with:
  - `students` - Array of attendance records (studentId, status)
  - May return empty or 404 if no attendance recorded yet

### POST `/api/attendance`

- **Purpose**: Submits attendance records for the class and date
- **Triggered**: On "Mark Attendance" button click
- **Payload**:
  - `classId` - ID of the class
  - `date` - Selected date in ISO format
  - `students` - Array of objects: `[{ studentId, status }]`
- **Response**: Success confirmation
- **Action**: Creates new attendance record or updates existing one

## 5️⃣ User Actions Supported

### Primary Actions

- **Select Date** - Choose date for attendance (defaults to today)
- **Change Student Status** - Click status bar to cycle through:
  - PRESENT → ABSENT → LEAVE → PRESENT
- **Submit Attendance** - Click "Mark Attendance" button to save
- **Update Attendance** - Edit and resubmit for already marked dates

### Information Display

- **View Class Info** - See class name and section
- **View Student List** - All students with roll numbers
- **View Attendance Status** - Visual status indicators (color-coded)
- **Detect Existing Attendance** - UI shows if attendance already exists for the date

### Navigation

- **Return to Dashboard** - Navigate back (browser back button)
- **View Student History** - Not directly linked but related page exists

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for page sections
- **Button** - Primary action button ("Mark Attendance")
- **AttendanceStatusBar** - Custom status selector component with:
  - Color-coded visual indicator
  - Click to cycle through statuses
  - PRESENT (green), ABSENT (red), LEAVE (yellow)
  - Accessible labels

### Form Components

- **Date Input** - HTML5 date picker
- **Table Structure** - Student list table with:
  - Student name column
  - Roll number column
  - Status selector column

### Feedback Components

- **Toast** - Notifications via useToast hook
- **Loading Indicator** - "Submitting..." button state

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Only for class teachers (subject teachers cannot mark attendance)
- No bulk status setting (set all present/absent)
- Cannot mark partial day attendance (half-day)
- No attendance notes/remarks field
- No student photo display
- No quick filter (show only absent, etc.)
- Cannot mark attendance for future dates (UI allows but should validate)
- No undo functionality after submission
- No offline support

### Planned Features

#### Attendance Enhancement

- Bulk actions:
  - Mark all as present
  - Mark all as absent
  - Invert selection
- Additional statuses:
  - Half-day present
  - Late arrival
  - Early departure
  - Sick leave
  - Authorized/unauthorized absence
- Attendance notes/remarks per student
- Reason for absence dropdown
- Photo display for each student
- Search/filter students

#### Date & Period Management

- Block future date attendance
- Period-wise attendance (multiple periods per day)
- Mark attendance for date ranges (holidays)
- Quick date navigation (prev/next day buttons)
- Week view calendar
- Monthly attendance grid view

#### Validation & Alerts

- Warning before navigating away with unsaved changes
- Confirmation dialog before submission
- Validation for required fields
- Duplicate submission prevention
- Network error retry mechanism

#### Reports & Analytics

- Daily summary (X present, Y absent, Z on leave)
- Attendance percentage per student
- Weekly/monthly summary
- Absentee list export
- Attendance reports (PDF/Excel)
- Trend charts

#### Notifications

- Send SMS/email to parents on absence
- Daily attendance submission reminders
- Late submission alerts
- Absentee pattern detection

### Technical Notes

- Uses ISO date format (YYYY-MM-DD) for consistency
- AttendanceValue type: "PRESENT" | "ABSENT" | "LEAVE"
- Status defaults to "PRESENT" for new entries
- Existing attendance is loaded when date changes
- Silent failure for GET attendance (assumes no records)
- Two-way API response format handling
- Client-side state management for attendance data
- No auto-save (manual submission required)
- Token-based authentication via `getToken("teacher")`
- Toast ref pattern to avoid dependency issues

### Data Flow

1. Load class and students on mount
2. Load existing attendance when date changes
3. User modifies status via AttendanceStatusBar
4. State updates locally
5. User clicks submit
6. POST request with all student statuses
7. Success toast and potential redirect/refresh

### Attendance Status Colors

- **PRESENT**: Green (#10b981 or similar)
- **ABSENT**: Red (#ef4444 or similar)
- **LEAVE**: Yellow/Amber (#f59e0b or similar)
