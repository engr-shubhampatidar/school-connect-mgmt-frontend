# Admin Dashboard Page Documentation

## 1️⃣ Page Overview

The Admin Dashboard Page serves as the main landing page for administrators after login. It provides an at-a-glance overview of key school metrics and recent activities.

**Purpose**: Centralized overview dashboard displaying school statistics and recent student enrollments.

**Target User Roles**: Admin

## 2️⃣ Route Information

- **Frontend Route**: `/admin/dashboard`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Admin only (requires admin authentication)

## 3️⃣ Completed Functionalities

- ✅ **Displaying school statistics** - Real-time counts of:
  - Total Students
  - Total Classes
  - Total Teachers
  - School ID (shortened format)
- ✅ **Recent students list** - Display of recently added students
- ✅ **Loading states** - Skeleton loaders for stats cards and lists
- ✅ **Error handling** - Error display with retry functionality
- ✅ **Responsive grid layout** - Adapts to different screen sizes (1 col mobile, 2 cols tablet, 4 cols desktop)
- ✅ **School ID formatting** - Displays shortened ID for better readability

## 4️⃣ API Integrations

### GET `/api/admin/dashboard`

- **Purpose**: Fetches dashboard overview data
- **Triggered**: On page load
- **Query Parameters**: None
- **Response**: Returns dashboard object with:
  - `schoolId` - Unique school identifier
  - `totalStudents` - Count of all students
  - `totalClasses` - Count of all classes
  - `totalTeachers` - Count of all teachers
  - `recentStudents` - Array of recently added students (id, name, createdAt)

## 5️⃣ User Actions Supported

### Primary Actions

- **View Statistics** - See real-time school metrics at a glance
- **View Recent Students** - See list of newly enrolled students
- **Retry Loading** - Click retry button in RecentStudents component if data fetch fails

### Navigation Actions (Implicit)

- Navigate to Students page (from stats or recent students)
- Navigate to Classes page (from stats)
- Navigate to Teachers page (from stats)

### Planned Actions (Not Implemented)

- Click stat cards to navigate to detail pages
- View more recent students (pagination/show more)
- Quick actions (Add Student, Add Teacher, Add Class)
- Notifications/alerts panel
- Attendance summary

## 6️⃣ UI Components Used

### Main Components

- **StatCard** - Reusable statistic card with:
  - Icon display (Users, BookOpen, ClipboardList from lucide-react)
  - Label text
  - Value display
  - Hover effects
  - Responsive design
- **RecentStudents** - List component showing:
  - Student names
  - Creation timestamps
  - Loading state
  - Error state with retry button
  - Empty state
- **Card** (implicit in RecentStudents) - Container for content sections

### Layout Components

- **Grid Layout** - Responsive grid for stat cards
- **Container** - Page container with padding

### Icons Used

- `Users` - For total students
- `BookOpen` - For total classes
- `ClipboardList` - For total teachers

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Stat cards are not clickable (no navigation)
- Recent students list shows limited items (no pagination)
- No date range selector for statistics
- No charts or graphs
- No attendance overview
- No pending actions/notifications
- School ID shortened may be confusing (no tooltip with full ID)

### Planned Features

#### Statistics Enhancements

- Clickable stat cards navigating to detail pages
- Trend indicators (increase/decrease from previous period)
- Comparison with previous month/year
- Attendance rate percentage
- Active vs inactive students
- Teacher-student ratio
- Average class size

#### Dashboard Widgets

- Charts and graphs (line, bar, pie):
  - Student enrollment trends
  - Attendance trends
  - Class distribution
  - Subject popularity
- Calendar widget showing upcoming events
- Quick actions panel (Add Student, Add Teacher, etc.)
- Notifications and alerts panel
- Pending approvals/tasks
- Fee collection summary
- Exam schedule widget

#### Recent Activities

- Pagination or "Show More" for recent students
- Recent teachers added
- Recent class creations
- Recent attendance submissions
- Activity timeline/feed

#### Customization

- Dashboard widget customization (drag & drop)
- User preference for visible widgets
- Date range selector for metrics
- Export dashboard report as PDF
- Scheduled email reports

### Technical Notes

- Uses axios for API calls with error handling
- Loading skeletons match card dimensions
- School ID display: Shows first 8 and last 4 characters
- Error handling with axios type guards
- No polling/real-time updates (static on load)
- Icons from lucide-react library
- Responsive CSS grid (1/2/4 columns)
- Toast notifications not used (but could be added)
