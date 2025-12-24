# Teacher Login Page Documentation

## 1️⃣ Page Overview

The Teacher Login Page provides authentication interface for teachers to access their dashboard and attendance management features.

**Purpose**: Secure authentication entry point for teacher users.

**Target User Roles**: Teacher

## 2️⃣ Route Information

- **Frontend Route**: `/teacher/login`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Public (unauthenticated users)

## 3️⃣ Completed Functionalities

- ✅ **Email & password authentication** - Standard login form
- ✅ **Form validation** - Client-side validation using Zod schema:
  - Email format validation
  - Password minimum length (6 characters)
- ✅ **Token storage** - Stores JWT token on successful login
- ✅ **Automatic redirection** - Redirects to teacher dashboard after successful login
- ✅ **Loading states** - Disabled submit button during authentication with text change
- ✅ **Toast notifications** - Error messages displayed via toast
- ✅ **Error handling** - Extracts error messages from API responses

## 4️⃣ API Integrations

### POST `/api/teacher/auth/login`

- **Purpose**: Authenticates teacher credentials and returns access token
- **Triggered**: On form submission
- **Payload**:
  - `email` - Teacher email address
  - `password` - Teacher password
- **Response**: Returns authentication object with:
  - `token` or `accessToken` - JWT for authenticated requests
  - Additional user data (optional)
- **Success**: Stores token in local storage as "teacher" and redirects to `/teacher/dashboard`
- **Error**: Displays error message in toast notification

## 5️⃣ User Actions Supported

### Authentication Actions

- **Enter Credentials** - Input email and password
- **Submit Form** - Click "Sign in" button or press Enter
- **View Validation Errors** - See inline field validation errors
- **Retry Login** - Re-submit after correcting errors

### Planned Actions (Not Implemented)

- **Forgot Password** - Password recovery flow
- **Remember Me** - Persistent login option
- **View Password** - Toggle password visibility
- **First-time setup** - Initial password change for new accounts

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for login form with styling
- **Form** - Form wrapper with validation handling
- **FormField** - Individual field containers
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error display
- **Input** - Text and password input fields
- **Button** - Submit button with loading state

### Layout

- **Centered Layout** - Vertically centered card
- **Responsive Design** - Adapts to screen sizes
- **Minimal Padding** - Clean, focused design

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- No "Forgot Password" functionality
- No "Remember Me" option
- No password visibility toggle
- No rate limiting UI
- No multi-factor authentication
- Password requirement less strict than admin (6 chars vs admin's full validation)
- No first-time login flow

### Planned Features

#### Enhanced Security

- Multi-factor authentication (MFA/2FA)
- Password visibility toggle
- Password strength indicator (if signup exists)
- Rate limiting with lockout messages
- CAPTCHA after failed attempts
- Session timeout with warning
- Secure password reset flow

#### User Experience

- "Remember Me" checkbox
- Auto-fill support optimization
- Loading spinner on button
- Better error messages with hints
- Session expired redirect with message
- Keep me signed in option

#### Account Management

- First-time login wizard
- Password change requirement
- Terms of service acceptance
- Email verification status
- Profile completion prompt

#### Alternative Authentication

- Single Sign-On (SSO) integration
- OAuth providers (Google, Microsoft)
- Magic link email login
- QR code login

### Technical Notes

- Uses React Hook Form for form state management
- Zod schema validation with minimum password length
- Token stored via `loginTeacher()` function which calls `setToken("teacher", token)`
- Uses Next.js `useRouter` for client-side navigation
- Toast notifications via `useToast` hook
- Error messages extracted from response.data.message or err.message
- Submit button shows "Signing in..." during loading
- Password minimum length: 6 characters (less strict than admin)

### Comparison with Admin Login

**Similarities:**

- Same basic form structure
- Token-based authentication
- Toast notifications
- Form validation with Zod

**Differences:**

- Teacher login has simpler password validation (6 chars min)
- Different API endpoint (`/api/teacher/auth/login`)
- Different token storage key ("teacher")
- Redirects to `/teacher/dashboard` instead of `/admin/dashboard`
- Simpler form (no additional fields)

### Security Considerations

- Implement HTTPS in production
- Add rate limiting on backend
- Implement session management
- Add logout functionality
- Consider JWT refresh tokens
- Implement secure password policies
- Add login activity logging
- Consider device fingerprinting
- Implement brute force protection

### Future Validation Enhancements

Consider matching admin password requirements:

- Minimum 8 characters (currently 6)
- Uppercase letter
- Lowercase letter
- Number
- Special character
