# Student Attendance History Page Documentation

## 1️⃣ Page Overview

The Student Attendance History Page displays a detailed attendance record for an individual student, showing their attendance status over time. This page is accessible to teachers to review a student's attendance patterns.

**Purpose**: Individual student attendance record viewing with historical data.

**Target User Roles**: Teacher

## 2️⃣ Route Information

- **Frontend Route**: `/teacher/attendance/[studentId]`
- **Dynamic Route Parameter**: `studentId` - The unique identifier of the student
- **Example**: `/teacher/attendance/123e4567-e89b-12d3-a456-426614174000`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Teacher only (requires teacher authentication)

## 3️⃣ Completed Functionalities

- ✅ **Authentication check** - Redirects to login if not authenticated
- ✅ **Dynamic student ID routing** - Loads data based on URL parameter
- ✅ **Student name display** - Shows student name in page header
- ✅ **Attendance history table** - Displays up to 10 most recent records
- ✅ **Date sorting** - Records sorted by date (most recent first)
- ✅ **Status display** - Shows attendance status for each date
- ✅ **Date formatting** - User-friendly date display
- ✅ **Empty state handling** - Message when no attendance records exist
- ✅ **Loading states** - Shows loading indicator during data fetch
- ✅ **Flexible API response handling** - Supports multiple response formats
- ✅ **Error handling** - Graceful failure with empty state

## 4️⃣ API Integrations

### GET `/api/attendance/student/{studentId}`

- **Purpose**: Fetches attendance history for a specific student
- **Triggered**: On page load
- **URL Parameter**: `studentId` - Student's unique identifier
- **Response**: Supports multiple formats:
  - **Format 1**: Direct array of records
  - **Format 2**: Object with `records`, `attendance`, `attendances`, `history`, or `rows` property
  - **Format 3**: Object with `student.name` for student info
- **Record Structure**:
  - `date` / `createdAt` / `day` - Date of attendance
  - `status` / `attendance` / `value` - Attendance status
  - `student.name` / `studentName` / `name` - Student name (optional)
- **Limit**: Returns up to 10 most recent records (client-side limit)

## 5️⃣ User Actions Supported

### Information Display

- **View Student Name** - See student's name in header
- **View Attendance Records** - See historical attendance data in table format
- **View Date** - See formatted date for each record
- **View Status** - See attendance status (PRESENT, ABSENT, LEAVE)

### Navigation

- **Return to Dashboard** - Navigate back using browser back button
- **Return to Attendance Page** - Navigate to attendance marking page

### Planned Actions (Not Implemented)

- **Date range filter** - Select custom date range
- **Export records** - Download as PDF/Excel
- **View detailed notes** - See attendance remarks
- **Compare periods** - Compare attendance across months
- **Print report** - Print attendance report

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for page sections:
  - Header card with student name
  - Table card with attendance records
- **Table** - Simple HTML table with:
  - Date column
  - Status column
  - Responsive design
  - Border styling

### Layout

- **Space-y Layout** - Vertical spacing between sections
- **Padding** - Page padding (p-4)

### Typography

- **Heading** - Large semibold font for student name
- **Table Headers** - Left-aligned, muted text color
- **Table Cells** - Clean, readable formatting

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Limited to 10 most recent records (no pagination)
- No date range selection
- No filtering by status
- No statistics/summary
- No export functionality
- No visual charts/graphs
- Student name might not load if not in API response
- Silent error handling (no error message displayed)
- No way to edit historical attendance

### Planned Features

#### Data Display Enhancements

- **Pagination** - Show all records with page navigation
- **Date Range Filter** - Select custom start and end dates
- **Status Filter** - Filter by PRESENT, ABSENT, LEAVE
- **Search** - Search by date
- **Sorting** - Sort by date (asc/desc) or status

#### Statistics & Analytics

- **Attendance Summary**:
  - Total days recorded
  - Days present
  - Days absent
  - Days on leave
  - Attendance percentage
- **Visual Charts**:
  - Monthly attendance bar chart
  - Status distribution pie chart
  - Attendance trend line graph
- **Comparison Metrics**:
  - Compare with class average
  - Compare with previous month/term

#### Additional Information

- **Detailed View**:
  - Attendance notes/remarks
  - Time of marking (if recorded)
  - Marked by which teacher
  - Reason for absence
- **Student Details**:
  - Student photo
  - Class and section
  - Roll number
  - Contact information

#### Actions & Export

- **Export Options**:
  - Download as PDF
  - Download as Excel/CSV
  - Print formatted report
  - Email to parent
- **Edit Capability**:
  - Correct erroneous entries (with permission)
  - Add retroactive attendance
  - Add notes to existing records

#### Notifications

- **Alert Patterns**:
  - Highlight consecutive absences
  - Show warning for low attendance
  - Flag unusual patterns

### Technical Notes

- Uses Next.js dynamic routing with `[studentId]` folder
- Separated into wrapper page and client component
- Client component handles data fetching and state
- Token-based authentication check
- Automatic redirect to login if unauthenticated
- Flexible response normalization for various API formats
- Client-side sorting by date (descending)
- Slice to 10 records after sorting
- Fallback values for missing data (shows "-")
- Silent error handling (empty state on error)
- Uses TAPI (teacher API instance) with auth interceptor

### Data Normalization

The component handles various API response structures:

```typescript
// Supports these response formats:
1. Array directly: [record1, record2, ...]
2. Object with array: { records: [...] }
3. Object with alternate keys: { attendance: [...] }
4. With student info: { student: { name: "..." }, records: [...] }
```

### Date Formatting

- Uses `new Date().toLocaleDateString()` for locale-aware formatting
- Converts ISO dates to readable format
- Handles missing dates with "-" placeholder

### Record Limit Rationale

Currently limited to 10 records to:

- Keep UI clean and focused
- Reduce data transfer
- Improve page load speed
- Provide "recent" overview

Should implement pagination for full history access.
