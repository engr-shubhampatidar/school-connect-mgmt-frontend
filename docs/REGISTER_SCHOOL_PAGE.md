# Register School Page Documentation

## 1️⃣ Page Overview

The Register School Page provides a registration interface for schools to create an account in the school management system. This is the onboarding entry point for new schools.

**Purpose**: School registration and onboarding form for new institutions.

**Target User Roles**: School administrators, New schools (unauthenticated)

## 2️⃣ Route Information

- **Frontend Route**: `/register-school`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Public (no authentication required)

## 3️⃣ Completed Functionalities

- ✅ **School registration form** - Fields include:
  - School name (required)
  - Admin email (required, validated)
  - Admin password (required, strong validation)
  - School address (optional)
  - Contact number (optional)
  - School logo URL (optional, validated)
- ✅ **Strong password validation** - Requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- ✅ **Form validation** - Client-side validation using Zod schema
- ✅ **Real-time validation** - onChange validation mode
- ✅ **URL validation** - Logo URL must be valid URL format
- ✅ **Server-side error handling** - Maps backend field errors to form
- ✅ **Toast notifications** - Success and error feedback
- ✅ **Form reset** - Clears form after successful registration
- ✅ **Loading states** - Button disabled during submission

## 4️⃣ API Integrations

### POST `/api/public/register-school`

- **Purpose**: Registers a new school and creates admin account
- **Triggered**: On form submission
- **Payload**:
  - `name` - School name (required)
  - `email` - Admin email address (required, validated)
  - `password` - Admin password (required, strong validation)
  - `address` - School address (optional, empty string if not provided)
  - `contact` - Contact number (optional, empty string if not provided)
  - `logoUrl` - School logo URL (optional, empty string if not provided, must be valid URL)
- **Response**: Success confirmation
- **Success**: Shows success toast and resets form
- **Error**: Displays field-specific or general error messages

## 5️⃣ User Actions Supported

### Primary Actions

- **Fill Registration Form** - Enter school and admin details
- **Submit Registration** - Create school account
- **View Validation Errors** - Real-time field validation feedback
- **View Password Requirements** - See validation error messages
- **Retry Registration** - Re-submit after correcting errors

### Planned Actions (Not Implemented)

- **View password** - Toggle password visibility
- **Password strength indicator** - Visual strength meter
- **Email verification** - Verify email before registration
- **Terms acceptance** - Terms of service checkbox
- **School type selection** - Primary, Secondary, University, etc.
- **Upload logo** - File upload instead of URL
- **Multi-step registration** - Wizard-style form

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for registration form
- **Form** - Form wrapper with validation
- **FormField** - Individual field containers
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error display
- **Input** - Text, email, password, and URL input fields
- **Button** - Submit button
- **ToastProvider** - Toast notification context

### Layout

- **Centered Layout** - Centered on screen with min-height
- **Background** - Slate-50 background color
- **Full-width Card** - Max-width 3xl, then md for form
- **Responsive Design** - Adapts to screen sizes

### Form Fields

- School name input
- Email input (type="email")
- Password input (type="password")
- Address input (optional)
- Contact input (optional)
- Logo URL input (optional, validated)

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- Logo must be provided as URL (no file upload)
- No email verification before registration
- No terms of service acceptance
- No password strength indicator
- No password visibility toggle
- No duplicate email check before submission
- No school type/category selection
- Single-step registration (no wizard)
- No captcha/spam protection

### Planned Features

#### Registration Enhancement

- **Email Verification**:
  - Send verification email
  - Verify email before activation
  - Resend verification link
- **Password Features**:
  - Password visibility toggle
  - Password strength meter (weak/medium/strong)
  - Password suggestions
  - Confirm password field
- **Terms & Privacy**:
  - Terms of service checkbox
  - Privacy policy link
  - Data processing agreement
- **CAPTCHA** - reCAPTCHA or hCaptcha for spam prevention

#### Multi-step Registration Wizard

**Step 1: School Information**

- School name
- School type (Primary/Secondary/High School/University)
- Address
- Contact details
- Website
- Established year

**Step 2: Admin Account**

- Full name
- Email
- Password
- Phone number

**Step 3: School Details**

- Logo upload (not URL)
- Number of students
- Number of teachers
- Curriculum type
- Accreditation info

**Step 4: Review & Submit**

- Review all information
- Edit any section
- Terms acceptance
- Final submission

#### File Upload

- **Logo Upload**:
  - Drag & drop interface
  - Image preview
  - Size validation (max 2MB)
  - Format validation (PNG, JPG, SVG)
  - Crop/resize functionality
  - Direct file upload (not URL)

#### Validation Enhancements

- **Email**:
  - Real-time availability check
  - Email format suggestions
  - Domain verification
- **School Name**:
  - Check for existing school
  - Suggest unique name if duplicate
- **Contact**:
  - Phone format validation
  - Country code dropdown
  - SMS verification

#### Post-Registration

- **Confirmation Email** - Send welcome email with next steps
- **Auto-login** - Log user in after successful registration
- **Onboarding Wizard** - Guide through initial setup
- **Dashboard Tour** - Interactive tutorial
- **Sample Data** - Option to populate with demo data

#### Additional Features

- **School Categories**:
  - Public/Private
  - Day/Boarding
  - Co-ed/Single-gender
  - Religious affiliation
- **Subscription Plan** - Select pricing tier during registration
- **Referral Code** - Apply discount/referral code
- **Social Signup** - Register via Google/Microsoft

### Technical Notes

- Uses React Hook Form for form state management
- Zod schema validation with complex password regex
- Password regex: `/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/`
- Email validation ensures valid email format
- URL validation ensures valid logo URL format
- Optional fields converted to empty strings (backend compatibility)
- Toast notifications with unique IDs prevent duplicates
- Form reset clears all fields after successful registration
- onChange validation mode for real-time feedback
- Error mapping supports field-specific and general errors
- Uses public API endpoint (no authentication required)
- ToastProvider wrapper required for toast functionality

### Registration Schema

```typescript
{
  name: string (min 1 char),
  email: string (valid email),
  password: string (min 8, uppercase, lowercase, number, special char),
  address: string | "" (optional),
  contact: string | "" (optional),
  logoUrl: string | "" (optional, valid URL)
}
```

### Password Requirements

- **Length**: Minimum 8 characters
- **Uppercase**: At least 1 uppercase letter (A-Z)
- **Lowercase**: At least 1 lowercase letter (a-z)
- **Number**: At least 1 digit (0-9)
- **Special**: At least 1 special character (!@#$%^&\*, etc.)

Example valid passwords:

- `School@123`
- `Admin2024!`
- `MyPass#789`

### Security Considerations

- Implement rate limiting on backend
- Add CAPTCHA to prevent automated registrations
- Sanitize all inputs on backend
- Hash passwords with strong algorithm (bcrypt, argon2)
- Implement email verification before activation
- Prevent duplicate registrations (email uniqueness)
- Log registration attempts for security monitoring
- Consider account approval workflow
- Implement IP-based throttling
- Add honeypot field for bot detection

### Post-Registration Flow

After successful registration:

1. Account created but not activated
2. Verification email sent to admin
3. Admin clicks verification link
4. Account activated
5. Admin logs in
6. Onboarding wizard starts
7. Initial setup (add classes, subjects, etc.)
8. Ready to use system
