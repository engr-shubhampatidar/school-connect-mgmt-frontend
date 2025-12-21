# Admin Login Page Documentation

## 1️⃣ Page Overview

The Admin Login Page provides authentication interface for school administrators to access the admin panel. It features form validation and secure credential submission.

**Purpose**: Secure authentication entry point for administrative users.

**Target User Roles**: Admin

## 2️⃣ Route Information

- **Frontend Route**: `/admin/login`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Public (unauthenticated users)

## 3️⃣ Completed Functionalities

- ✅ **Email & password authentication** - Standard login form
- ✅ **Form validation** - Client-side validation using Zod schema:
  - Email format validation
  - Password presence check
- ✅ **Real-time validation** - onChange validation mode
- ✅ **Server-side error handling** - Maps backend errors to form fields
- ✅ **Token storage** - Stores JWT token on successful login
- ✅ **Automatic redirection** - Redirects to admin dashboard after successful login
- ✅ **Loading states** - Disabled submit button during authentication
- ✅ **Toast notifications** - Success and error messages

## 4️⃣ API Integrations

### POST `/api/admin/auth/login`

- **Purpose**: Authenticates admin credentials and returns access token
- **Triggered**: On form submission
- **Payload**:
  - `email` - Admin email address
  - `password` - Admin password
- **Response**: Returns authentication object with:
  - `token` or `accessToken` - JWT for authenticated requests
  - Additional user data (optional)
- **Success**: Stores token in local storage and redirects to `/admin/dashboard`
- **Error**: Displays field-specific or general error messages

## 5️⃣ User Actions Supported

### Authentication Actions

- **Enter Credentials** - Input email and password
- **Submit Form** - Click "Sign in" button or press Enter
- **View Validation Errors** - Real-time field validation feedback
- **Retry Login** - Re-submit after correcting errors

### Planned Actions (Not Implemented)

- **Forgot Password** - Password recovery flow
- **Remember Me** - Persistent login option
- **View Password** - Toggle password visibility
- **Sign Up** - New admin registration (if allowed)
- **SSO Login** - Single sign-on integration

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for login form with styling
- **Form** - Form wrapper with validation handling
- **FormField** - Individual field containers
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error display
- **Input** - Text and password input fields
- **Button** - Submit button

### Layout

- **Centered Layout** - Full-screen centered card
- **Background** - Slate-50 background color
- **Responsive Padding** - Adapts to screen size

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- No "Forgot Password" functionality
- No "Remember Me" option
- No password visibility toggle
- No rate limiting UI (3 attempts, lockout, etc.)
- No social/SSO login options
- No multi-factor authentication (MFA)
- No session timeout warning

### Planned Features

#### Enhanced Security

- Multi-factor authentication (MFA/2FA)
- Password visibility toggle
- Password strength indicator
- Rate limiting with lockout messages
- CAPTCHA after failed attempts
- Session timeout with warning
- Secure password reset flow

#### User Experience

- "Remember Me" checkbox
- Auto-fill support optimization
- Keyboard shortcuts (Enter to submit)
- Loading spinner on button
- Better error messages with action hints
- Session expired redirect with message

#### Alternative Authentication

- Single Sign-On (SSO) integration
- OAuth providers (Google, Microsoft)
- Magic link email login
- Biometric authentication (future)

#### Account Management

- First-time login wizard
- Terms of service acceptance
- Password expiry notifications
- Force password change on first login

### Technical Notes

- Uses React Hook Form for form state management
- Zod schema validation via `adminLoginSchema`
- Token stored with `setToken("admin", token)`
- Uses axios interceptors for request/response handling
- Toast notifications via `useToast` hook
- Client-side routing with Next.js `useRouter`
- Error mapping supports both field errors and general messages
- Validation mode: onChange (real-time feedback)
- No plain text password storage
- Redirects to dashboard on success

### Security Considerations

- Implement HTTPS in production
- Consider implementing CSRF tokens
- Add rate limiting on backend
- Implement session management
- Add logout functionality on other pages
- Consider JWT refresh tokens
- Implement secure password policies
- Add login activity logging
