# Admin Students Page Documentation

## 1️⃣ Page Overview

The Admin Students Page provides a centralized interface for managing student records in the school management system. Administrators can view, search, filter, and create student profiles with class assignments.

**Purpose**: Complete student data management including enrollment, class assignment, and record maintenance.

**Target User Roles**: Admin

## 2️⃣ Route Information

- **Frontend Route**: `/admin/students`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Admin only (requires admin authentication)

## 3️⃣ Completed Functionalities

- ✅ **Viewing student list** - Paginated table display of all students
- ✅ **Pagination** - Navigate through student records (10 records per page)
- ✅ **Filtering students** - Filter by:
  - Search (name/roll number)
  - Class
  - Status
- ✅ **Creating new students** - Modal dialog for student creation with:
  - Full name
  - Roll number (optional)
  - Class assignment
  - Photo URL (optional)
- ✅ **Loading states** - Skeleton loaders during data fetch
- ✅ **Error handling** - Error display with retry functionality
- ✅ **Empty state handling** - User-friendly message when no students exist
- ✅ **Refresh after creation** - Automatic list refresh when new student is added

## 4️⃣ API Integrations

### GET `/api/admin/students`

- **Purpose**: Fetches paginated list of students with filtering support
- **Triggered**: On page load, filter changes, pagination changes
- **Query Parameters**:
  - `search` - Search by name or roll number
  - `class` - Filter by class ID
  - `status` - Filter by student status
  - `page` - Current page number
  - `pageSize` - Number of records per page (default: 10)
- **Response**: Returns students array with class information, total count, and pagination metadata

### POST `/api/admin/students`

- **Purpose**: Creates a new student record
- **Triggered**: On form submission in CreateStudentDialog
- **Payload**:
  - `name` - Student's full name (required)
  - `rollNo` - Student roll number (optional)
  - `classId` - Assigned class ID (required)
  - `photoUrl` - Student photo URL (optional, validated)
- **Response**: Returns created student ID or student object

### GET `/api/admin/classes`

- **Purpose**: Fetches list of available classes for dropdown selection
- **Triggered**: On CreateStudentDialog mount
- **Response**: Returns array of class objects with id, name, and section

## 5️⃣ User Actions Supported

### Primary Actions

- **Add Student** - Click "Add Student" button to open creation dialog
- **Apply Filters** - Use filter bar to search and filter students
- **Clear Filters** - Reset all applied filters to view all students
- **Navigate Pages** - Use pagination controls to browse student records
- **Retry Loading** - Click retry button if data fetch fails

### Create Student Dialog Actions

- **Fill Form** - Enter student details
- **Select Class** - Choose class from dropdown (displays name and section)
- **Enter Photo URL** - Optional profile photo URL with validation
- **Submit** - Create student record
- **Cancel** - Close dialog without saving

### Planned Actions (Not Implemented)

- **View Student** - Currently logs to console only
- **Edit Student** - Currently logs to console only
- **View Attendance History** - Student attendance records
- **Delete Student** - Remove student record

## 6️⃣ UI Components Used

### Main Components

- **StudentsTable** - Main table component with:
  - Student name column
  - Roll number column
  - Class information (with section)
  - Creation date
  - Pagination controls
  - Loading skeleton
  - Error display
  - Action buttons per row
- **StudentsFilterBar** - Filter panel with:
  - Search input (name/roll number)
  - Class dropdown filter
  - Status dropdown filter
  - Apply/Clear buttons
- **CreateStudentDialog** - Modal form with:
  - Name input (required)
  - Roll number input (optional)
  - Class dropdown (required)
  - Photo URL input (optional, validated)
  - Form validation
- **Button** - Primary action button
- **Card** - Container for dialogs and error states

### Form Components

- **Form** - Form wrapper with validation
- **FormField** - Individual form field wrapper
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error messages
- **Input** - Text input fields
- **Select** - Dropdown selection (class)

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- View functionality placeholder (logs to console)
- Edit functionality placeholder (logs to console)
- No student detail page
- No delete functionality
- No bulk operations
- No photo upload (only URL input)
- Status filter not fully implemented

### Planned Features

- Complete view student functionality with detailed profile
- Edit student information
- Delete student with confirmation
- Bulk actions (delete, export, promote)
- Student attendance history view
- Grade/marks management
- Parent/guardian information
- Student document uploads
- Advanced filtering (by gender, date of birth range)
- Export to CSV/Excel
- Import students from CSV/Excel
- Student photo upload instead of URL
- Fee payment tracking
- Promotion to next class
- Print student ID cards

### Technical Notes

- Uses React Hook Form for form management
- Implements Zod for schema validation
- Flexible response normalization handles various backend formats
- Client-side state management for filters and pagination
- Toast notifications for user feedback
- URL validation for photo field
- Dynamic class loading with fallback options
- Supports both class string and object formats from API
