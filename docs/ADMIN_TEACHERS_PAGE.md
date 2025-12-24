# Admin Teachers Page Documentation

## 1️⃣ Page Overview

The Admin Teachers Page provides a comprehensive interface for managing teacher records in the school management system. This page allows administrators to view, search, filter, and create teacher profiles with associated class and subject assignments.

**Purpose**: Centralized management of all teacher data including personal information, subject specializations, and class assignments.

**Target User Roles**: Admin

## 2️⃣ Route Information

- **Frontend Route**: `/admin/teachers`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Admin only (requires admin authentication)

## 3️⃣ Completed Functionalities

- ✅ **Viewing teacher list** - Paginated table display of all teachers
- ✅ **Pagination** - Navigate through teacher records (10 records per page)
- ✅ **Filtering teachers** - Filter by:
  - Search (name/email)
  - Email
  - Subject specialization
- ✅ **Creating new teachers** - Modal dialog for teacher creation with:
  - Full name, email, phone
  - Subject specialization selection
  - Class-subject assignments
  - Class teacher designation
- ✅ **Loading states** - Skeleton loaders during data fetch
- ✅ **Error handling** - Error display with retry functionality
- ✅ **Empty state handling** - User-friendly message when no teachers exist
- ✅ **Request cancellation** - Automatic cancellation of pending requests to prevent duplicate fetches

## 4️⃣ API Integrations

### GET `/api/admin/teachers`

- **Purpose**: Fetches paginated list of teachers with filtering support
- **Triggered**: On page load, filter changes, pagination changes
- **Query Parameters**:
  - `search` - Search by name/email
  - `email` - Filter by email
  - `subject` - Filter by subject
  - `page` - Current page number
  - `pageSize` - Number of records per page (default: 10)
- **Response**: Returns teachers array with total count and pagination metadata

### POST `/api/admin/teachers`

- **Purpose**: Creates a new teacher record
- **Triggered**: On form submission in CreateTeacherDialog
- **Payload**:
  - `fullName` - Teacher's full name
  - `email` - Teacher's email address
  - `phone` - Optional phone number
  - `subjects` - Array of subject IDs
  - `classTeacher` - Optional class ID if designated as class teacher
  - `assignClassSubjects` - Array of class-subject assignment objects
- **Response**: Returns created teacher ID or teacher object

### GET `/api/admin/classes`

- **Purpose**: Fetches list of available classes for dropdown selection
- **Triggered**: On CreateTeacherDialog mount
- **Response**: Returns array of class objects with id and name

### GET `/api/admin/subjects`

- **Purpose**: Fetches list of available subjects for dropdown selection
- **Triggered**: On CreateTeacherDialog mount
- **Response**: Returns array of subject objects with id and name

## 5️⃣ User Actions Supported

### Primary Actions

- **Add Teacher** - Click "Add Teacher" button to open creation dialog
- **Apply Filters** - Use filter bar to search and filter teachers
- **Clear Filters** - Reset all applied filters to view all teachers
- **Navigate Pages** - Use pagination controls to browse teacher records
- **Retry Loading** - Click retry button if data fetch fails

### Create Teacher Dialog Actions

- **Fill Form** - Enter teacher details in multi-step form
- **Select Subjects** - Choose one or multiple subject specializations
- **Assign Classes** - Add class-subject assignments
- **Set Class Teacher** - Optionally designate as class teacher for a specific class
- **Add/Remove Assignments** - Dynamically add or remove class-subject pairs
- **Submit** - Create teacher record
- **Cancel** - Close dialog without saving

### Planned Actions (Not Implemented)

- **Edit Teacher** - Currently logs to console only
- **Resend Invite** - Currently logs to console only
- **View Details** - Open teacher details drawer
- **Delete Teacher** - Remove teacher record

## 6️⃣ UI Components Used

### Main Components

- **TeachersTable** - Main table component with:
  - Sortable columns
  - Pagination controls
  - Loading skeleton
  - Error display
  - Action buttons per row
- **TeachersFilterBar** - Filter panel with:
  - Search input
  - Email filter
  - Subject dropdown
  - Apply/Clear buttons
- **CreateTeacherDialog** - Modal form with:
  - Multi-field form
  - Multi-select for subjects
  - Dynamic field array for assignments
  - Class teacher checkbox and selector
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
- **Select** - Dropdown selection
- **MultiSelect** - Multiple selection dropdown
- **Separator** - Visual section divider

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Edit functionality placeholder (logs to console)
- Resend invite functionality placeholder (logs to console)
- No teacher profile view/details page
- No delete functionality
- No bulk operations
- No export functionality

### Planned Features

- Complete edit teacher functionality
- Teacher details drawer implementation
- Resend invitation email
- Delete teacher with confirmation
- Bulk actions (delete, export)
- Advanced filtering (by class, by status)
- Teacher performance metrics
- Class schedule view
- Import teachers from CSV/Excel
- Profile photo upload
- Teacher availability management

### Technical Notes

- Uses React Hook Form for form management
- Implements Zod for schema validation
- AbortController prevents duplicate API calls
- Client-side pagination fallback when server doesn't paginate
- Flexible response normalization handles various backend formats
- Toast notifications for user feedback
