# Teacher Dashboard Page Documentation

## 1️⃣ Page Overview

The Teacher Dashboard Page serves as the main landing page for teachers after login. It displays the class they are assigned as class teacher, shows student list, and provides quick access to attendance management.

**Purpose**: Personalized dashboard for class teachers to view their assigned class and manage attendance.

**Target User Roles**: Teacher (specifically Class Teachers)

## 2️⃣ Route Information

- **Frontend Route**: `/teacher/dashboard`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Teacher only (requires teacher authentication)

## 3️⃣ Completed Functionalities

- ✅ **Authentication check** - Redirects to login if not authenticated
- ✅ **Teacher profile display** - Shows teacher name (welcome message)
- ✅ **Class information display** - Shows:
  - Class name
  - Section (if applicable)
  - Student count
- ✅ **Student list with photos** - Grid display of students with:
  - Profile photo (with fallback placeholder)
  - Student name
  - Roll number
  - Clickable cards to view attendance history
- ✅ **Loading states** - Skeleton loaders for page content
- ✅ **Empty state handling** - User-friendly message when teacher is not a class teacher
- ✅ **Quick action button** - "Take Attendance" button navigating to attendance page
- ✅ **Error handling** - Toast notifications for errors

## 4️⃣ API Integrations

### GET `/api/teacher/me`

- **Purpose**: Fetches authenticated teacher's profile information
- **Triggered**: On page load
- **Response**: Returns teacher object with:
  - `id` - Teacher ID
  - `name` - Teacher's full name
  - `email` - Teacher's email
  - `role` - User role
  - `classTeacherClassId` - ID of class if teacher is class teacher

### GET `/api/teacher/class`

- **Purpose**: Fetches class details and students for the teacher's assigned class
- **Triggered**: On page load
- **Response**: Returns two possible formats:
  - **Format 1**: `{ class: {...}, students: [...] }`
  - **Format 2**: Class object directly with students array inside
  - Class includes: `id`, `name`, `section`, `students`
  - Students include: `id`, `name`, `rollNo`, `photoUrl`

## 5️⃣ User Actions Supported

### Primary Actions

- **Take Attendance** - Navigate to attendance page via button
- **View Student Attendance History** - Click on student card to see their attendance records

### Information Display

- **View Class Information** - See assigned class name, section, and student count
- **View Student List** - Browse all students in the class

### Navigation

- **Automatic Redirect** - Redirected to login if not authenticated

### Empty State

- **Info Display** - Shows message if teacher is not assigned as class teacher for any class

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for sections:
  - Class information card
  - Student grid cards
  - Empty state card
- **Button** - "Take Attendance" action button
- **Image** (Next.js) - Student profile photos with:
  - Lazy loading
  - Fallback placeholder
  - Optimized loading

### Layout Components

- **Grid Layout** - Responsive student cards grid
- **Flex Layout** - Header section with button
- **Loading Skeletons** - Animated loading placeholders

### Student Card Features

- Profile photo (64x64px)
- Student name display
- Roll number display
- Hover effect
- Click navigation
- Fallback SVG for missing photos

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Only works for class teachers (teachers assigned to a specific class)
- Subject teachers without class teacher role see empty state
- No attendance summary on dashboard
- No recent attendance records display
- Student cards show limited information
- No search/filter for student list
- No quick attendance marking on dashboard

### Planned Features

#### Dashboard Enhancements

- Attendance summary widget:
  - Today's attendance status
  - Weekly/monthly attendance trends
  - Class attendance percentage
- Recent attendance records list
- Pending tasks/notifications
- Quick stats (present/absent/leave today)
- Calendar widget with marked dates

#### Student Information

- Search students by name or roll number
- Filter students by attendance status
- Sort students by name/roll number
- View more student details on hover
- Student performance indicators
- Recent activity per student

#### Quick Actions

- Quick mark attendance (inline on dashboard)
- Mark leave requests
- View class schedule
- Access class resources
- Send announcements to class

#### For Subject Teachers

- Show all classes where teacher teaches
- Subject-wise class navigation
- Teaching schedule view
- Multiple class support

#### Class Management

- Class announcements board
- Homework assignment list
- Upcoming tests/exams
- Class resources and materials
- Parent communication portal

### Technical Notes

- Uses Next.js Image component for optimized photos
- Fallback placeholder SVG for missing photos
- Token-based authentication check
- Supports two API response formats for flexibility
- Client-side routing with Next.js useRouter
- Loading state with skeleton UI
- Error handling with toast notifications
- Ref pattern for toast to avoid dependency warnings
- Graceful degradation if API fails
- Empty state for non-class teachers

### API Response Flexibility

The page handles two possible API response structures:

1. Nested format: `{ class: {...}, students: [...] }`
2. Flat format: Class object with embedded students array

This flexibility allows backend changes without breaking the UI.
