# Quick Reference: Login & Route Protection

## For Developers

### Overview
This system implements role-based authentication and route protection for Admin, Teacher, and Student users.

---

## Key Concepts

### 1. Token Storage
- **Location**: `localStorage`
- **Keys**: 
  - `sc:auth:admin:access` - Admin token
  - `sc:auth:teacher:access` - Teacher token
  - `sc:auth:student:access` - Student token
  - `sc:auth:{role}:profile` - User profile data

### 2. Route Protection
All routes are protected by layout files:
- `/app/admin/layout.tsx` - Protects all admin routes
- `/app/teacher/layout.tsx` - Protects all teacher routes
- `/app/student/layout.tsx` - Protects all student routes

**Exception**: Login pages are not protected (e.g., `/admin/login`)

### 3. Authentication Flow
```
Login → Store Token → Access Protected Routes → API Calls → Auto-logout on 401
```

---

## Common Tasks

### How to Add a New Protected Page

1. Create your page in the appropriate role folder:
   ```typescript
   // src/app/admin/my-new-page/page.tsx
   export default function MyNewPage() {
     return <div>My Protected Content</div>;
   }
   ```

2. **That's it!** The layout automatically protects it.

### How to Make an Authenticated API Call

The axios interceptors automatically attach tokens:

```typescript
// Admin API call
import API from '@/lib/axios';
const response = await API.get('/api/admin/users');

// Teacher API call  
import TAPI from '@/lib/teacherApi';
const response = await TAPI.get('/api/teacher/classes');

// Student API call
import studentApi from '@/lib/studentApi';
const response = await studentApi.get('/api/student/profile');
```

### How to Get Current User Info

```typescript
import { getUser } from '@/lib/auth';

const user = getUser('admin'); // or 'teacher' or 'student'
console.log(user?.name, user?.email);
```

### How to Check if User is Logged In

```typescript
import { getToken } from '@/lib/auth';

const isLoggedIn = !!getToken('admin'); // or 'teacher' or 'student'
```

### How to Logout Programmatically

```typescript
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const router = useRouter();

// Logout current user
logout('admin'); // or 'teacher' or 'student'
router.push('/admin/login');
```

---

## AuthGuard Components

Located in:
- `src/components/admin/AuthGuard.tsx`
- `src/components/teacher/AuthGuard.tsx`
- `src/components/student/AuthGuard.tsx`

### What They Do:
1. Check if token exists in localStorage
2. Show loading spinner while checking
3. Redirect to login if no token
4. Render children if token exists

### Usage (usually not needed directly):
```typescript
import AdminAuthGuard from '@/components/admin/AuthGuard';

export default function MyPage() {
  return (
    <AdminAuthGuard>
      <div>Protected Content</div>
    </AdminAuthGuard>
  );
}
```

**Note**: Layouts already apply AuthGuards, so you rarely need to use them directly.

---

## API Interceptors

### Request Interceptors
Automatically attach tokens to API requests:
- Admin: `/api/admin/*`
- Teacher: `/api/teacher/*` and `/api/attendance/*`
- Student: All requests

### Response Interceptors
Handle errors automatically:
- **401**: Clear token, redirect to login
- **403**: Log error to console
- **Network Error**: Propagate error

---

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Auth guard for all admin routes
│   │   ├── login/page.tsx      # Admin login (not protected)
│   │   └── dashboard/page.tsx  # Protected admin page
│   ├── teacher/
│   │   ├── layout.tsx          # Auth guard for all teacher routes
│   │   ├── login/page.tsx      # Teacher login (not protected)
│   │   └── dashboard/page.tsx  # Protected teacher page
│   └── student/
│       ├── layout.tsx          # Auth guard for all student routes
│       ├── login/page.tsx      # Student login (not protected)
│       └── dashboard/page.tsx  # Protected student page
├── components/
│   ├── admin/
│   │   └── AuthGuard.tsx       # Admin route protection
│   ├── teacher/
│   │   └── AuthGuard.tsx       # Teacher route protection
│   └── student/
│       └── AuthGuard.tsx       # Student route protection
└── lib/
    ├── auth.ts                 # Auth utilities
    ├── axios.ts                # Admin API client
    ├── teacherApi.ts           # Teacher API client
    └── studentApi.ts           # Student API client
```

---

## Environment Variables

None required for authentication! Tokens are stored in localStorage.

API base URL is configured in:
```typescript
// src/lib/api-routes.ts
export const BASE_URL = "your-api-url-here";
```

---

## Security Best Practices

### ✅ Do:
- Use the provided axios instances (API, TAPI, studentApi)
- Let AuthGuards handle route protection
- Let interceptors handle token attachment
- Trust backend for security validation

### ❌ Don't:
- Manually add Authorization headers (interceptors do this)
- Store sensitive data in component state
- Bypass AuthGuards for "admin-only" content
- Trust frontend validation for security

### ⚠️ Remember:
- Frontend security is for UX only
- Backend must validate all requests
- Tokens can be viewed in browser DevTools
- Always validate on the server

---

## Troubleshooting

### User Stuck on Login Page
**Symptom**: After successful login, redirects back to login  
**Cause**: Token not being stored  
**Fix**: Check browser console for localStorage errors

### Automatic Logout
**Symptom**: User logged out unexpectedly  
**Cause**: Token expired or API returned 401  
**Fix**: 
- Check token expiration on backend
- Verify API endpoint returns correct status codes

### Can't Access Protected Route
**Symptom**: Redirects to login immediately  
**Cause**: No valid token in localStorage  
**Fix**: 
- Login first
- Check if token is being stored correctly
- Verify token key matches role

### API Calls Fail with 401
**Symptom**: All API calls return unauthorized  
**Cause**: Token not attached to requests  
**Fix**:
- Use correct axios instance for role
- Check if token exists in localStorage
- Verify backend accepts token format

---

## Testing Checklist

When making changes to auth system, test:

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route without login
- [ ] Access protected route after login
- [ ] Logout clears tokens
- [ ] Page refresh preserves login
- [ ] API calls include token
- [ ] 401 response triggers logout
- [ ] Cross-role access blocked

---

## API Contract

### Login Endpoints

**Admin Login:**
```
POST /api/admin/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user }
```

**Teacher Login:**
```
POST /api/teacher/auth/login
Body: { email, password }
Response: { token or accessToken, user }
```

**Student Login:**
```
POST /api/student/auth/login
Body: { identifier (rollNumber), password }
Response: { accessToken, user }
```

### Expected Token Format

JWT with claims:
```json
{
  "sub": "user-id",
  "role": "admin|teacher|student",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Required Headers

All protected API requests:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Getting Help

1. **Read the docs first**:
   - `SUMMARY.md` - High-level overview
   - `TESTING_REPORT.md` - Detailed implementation
   - `BUG_REPORT.md` - Known issues

2. **Check the code**:
   - AuthGuard components have inline comments
   - Axios interceptors are well-documented

3. **Look at examples**:
   - Dashboard pages show typical usage
   - Login pages show authentication flow

---

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

**Last Updated**: January 23, 2026  
**Version**: 1.0.0
