# Admin Subjects Page Documentation

## 1️⃣ Page Overview

The Admin Subjects Page provides a management interface for academic subjects offered by the school. Administrators can view all subjects with their codes and create new subject entries.

**Purpose**: Centralized management of academic subjects including subject names and unique identifiers.

**Target User Roles**: Admin

## 2️⃣ Route Information

- **Frontend Route**: `/admin/subjects`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Admin only (requires admin authentication)

## 3️⃣ Completed Functionalities

- ✅ **Viewing subjects list** - Paginated table display of all subjects
- ✅ **Pagination** - Navigate through subject records (10 records per page)
- ✅ **Creating new subjects** - Modal dialog for subject creation with:
  - Subject name (e.g., "Mathematics", "Physics")
  - Subject code (e.g., "MATH101", "PHY201")
- ✅ **Loading states** - Skeleton loaders during data fetch
- ✅ **Error handling** - Error display with retry functionality
- ✅ **Empty state handling** - User-friendly message when no subjects exist with action button
- ✅ **Refresh after creation** - Automatic list refresh when new subject is added
- ✅ **Page boundary validation** - Automatically adjusts current page if it exceeds total pages

## 4️⃣ API Integrations

### GET `/api/admin/subjects`

- **Purpose**: Fetches paginated list of subjects
- **Triggered**: On page load, pagination changes, after creating a subject
- **Query Parameters**:
  - `page` - Current page number
  - `pageSize` - Number of records per page (default: 10)
  - `search` - Search by subject name (parameter exists but not used in UI)
- **Response**: Returns subjects array with id, name, code, and optional creation date

### POST `/api/admin/subjects`

- **Purpose**: Creates a new subject
- **Triggered**: On form submission in AddSubjectDialog
- **Payload**:
  - `name` - Subject name (required, min 2 characters)
  - `code` - Subject code (required, min 2 characters)
- **Response**: Returns created subject ID

## 5️⃣ User Actions Supported

### Primary Actions

- **Add Subject** - Click "Add Subject" button to open creation dialog
- **Navigate Pages** - Use pagination controls to browse subjects
- **Retry Loading** - Click retry button if data fetch fails

### Add Subject Dialog Actions

- **Fill Form** - Enter subject details:
  - Subject name (required)
  - Subject code (required)
- **Submit** - Create subject record
- **Cancel** - Close dialog without saving

### Empty State Actions

- **Add Subject** - Quick action button in empty state

### Planned Actions (Not Implemented)

- **Edit Subject** - Modify subject name or code
- **Delete Subject** - Remove subject (with validation for assigned teachers/classes)
- **Search Subjects** - Filter subjects by name or code
- **View Subject Details** - See teachers and classes using this subject

## 6️⃣ UI Components Used

### Main Components

- **Custom Subject Table** - Inline table with:
  - Subject name column
  - Subject code column
  - Hover effects on rows
  - Pagination summary
  - Pagination controls
  - Loading skeleton with animated placeholders
- **AddSubjectDialog** - Modal form with:
  - Subject name input (required)
  - Subject code input (required)
  - Form validation
  - Submit/Cancel buttons
- **Button** - Primary action button
- **Card** - Container for table, dialogs, and states

### Form Components

- **Form** - Form wrapper with validation
- **FormField** - Individual form field wrapper
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error messages
- **Input** - Text input fields

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- No edit functionality
- No delete functionality
- No search/filter functionality implemented
- No subject details view
- No validation for duplicate subject codes
- Cannot view teachers assigned to a subject
- Cannot view classes taking a subject

### Planned Features

- Edit subject name and code
- Delete subject with validation (check for teacher/class assignments)
- Search and filter subjects
- View subject details (teachers teaching it, classes assigned)
- Display teacher count per subject
- Display class count per subject
- Bulk subject creation
- Subject categorization (Science, Arts, Languages, etc.)
- Subject prerequisites management
- Credit hours/weightage assignment
- Subject description and syllabus
- Import subjects from CSV
- Export subjects list
- Duplicate detection for subject codes
- Subject archiving for discontinued subjects

### Technical Notes

- Uses React Hook Form for form management
- Implements Zod for schema validation
- Inline custom table implementation (not using StudentsTable component pattern)
- Pagination with total pages calculation
- Automatic page adjustment when total changes
- Toast notifications for user feedback
- Flexible response normalization for various API formats
- Subject code typically follows institutional naming conventions
- No uniqueness validation on client side (assumes backend validates)
