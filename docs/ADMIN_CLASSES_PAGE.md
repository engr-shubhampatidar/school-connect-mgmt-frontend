# Admin Classes Page Documentation

## 1️⃣ Page Overview

The Admin Classes Page provides a management interface for school classes and sections. Administrators can view all classes, create new classes, and manage class-related information.

**Purpose**: Centralized management of class structure including class names and sections.

**Target User Roles**: Admin

## 2️⃣ Route Information

- **Frontend Route**: `/admin/classes`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Admin only (requires admin authentication)

## 3️⃣ Completed Functionalities

- ✅ **Viewing classes list** - Paginated table display of all classes
- ✅ **Pagination** - Navigate through class records (10 records per page)
- ✅ **Creating new classes** - Modal dialog for class creation with:
  - Class name (e.g., "Class 10", "Grade 5")
  - Section (e.g., "A", "B", "C") - optional
- ✅ **Loading states** - Skeleton loaders during data fetch
- ✅ **Error handling** - Error display with retry functionality
- ✅ **Empty state handling** - User-friendly message when no classes exist
- ✅ **Refresh after creation** - Automatic list refresh when new class is added

## 4️⃣ API Integrations

### GET `/api/admin/classes`

- **Purpose**: Fetches paginated list of classes
- **Triggered**: On page load, pagination changes, after creating a class
- **Query Parameters**:
  - `page` - Current page number
  - `pageSize` - Number of records per page (default: 10)
  - `search` - Search by class name (parameter exists but not used in UI)
- **Response**: Returns classes array with id, name, section, and creation date

### POST `/api/admin/classes`

- **Purpose**: Creates a new class
- **Triggered**: On form submission in CreateClassDialog
- **Payload**:
  - `name` - Class name (required, min 2 characters)
  - `section` - Section identifier (optional)
- **Response**: Returns created class ID or class object

## 5️⃣ User Actions Supported

### Primary Actions

- **Add Class** - Click "Add Class" button to open creation dialog
- **Navigate Pages** - Use pagination controls to browse classes
- **Retry Loading** - Click retry button if data fetch fails

### Create Class Dialog Actions

- **Fill Form** - Enter class details:
  - Class name (required)
  - Section (optional)
- **Submit** - Create class record
- **Cancel** - Close dialog without saving

### Planned Actions (Not Implemented)

- **Edit Class** - Currently logs to console only
- **Delete Class** - Remove class (with validation for assigned students/teachers)
- **View Class Details** - See students and teachers assigned to class
- **Search Classes** - Filter classes by name

## 6️⃣ UI Components Used

### Main Components

- **ClassesTable** - Main table component with:
  - Class name column
  - Section column
  - Student count column (if implemented)
  - Creation date
  - Pagination controls
  - Loading skeleton
  - Error display
  - Action buttons per row
- **CreateClassDialog** - Modal form with:
  - Class name input (required)
  - Section input (optional)
  - Form validation
  - Submit/Cancel buttons
- **Button** - Primary action button
- **Card** - Container for dialogs and error states

### Form Components

- **Form** - Form wrapper with validation
- **FormField** - Individual form field wrapper
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error messages
- **Input** - Text input fields

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Edit functionality placeholder (logs to console)
- No delete functionality
- No search/filter functionality implemented
- No class details view
- No student/teacher count display
- No class schedule management
- Cannot view students assigned to a class

### Planned Features

- Complete edit class functionality
- Delete class with validation (check for assigned students/teachers)
- Search and filter classes
- View class details (students, teachers, subjects)
- Display student count per class
- Display teacher assignments per class
- Class schedule management
- Class capacity settings
- Academic year/semester assignment
- Bulk class creation
- Class promotion (move students to next class)
- Archive classes for past academic years
- Class-level settings and policies

### Technical Notes

- Uses React Hook Form for form management
- Implements Zod for schema validation
- Simple data structure (name + section)
- Pagination managed client-side
- Toast notifications for user feedback
- Flexible response normalization for various API formats
- Section is optional to support schools without section divisions
