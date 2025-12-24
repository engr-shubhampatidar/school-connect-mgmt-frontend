# Contact Page Documentation

## 1️⃣ Page Overview

The Contact Page provides a public-facing form for visitors to send inquiries, support requests, or general messages to the school administration.

**Purpose**: Public contact form for inquiries and support.

**Target User Roles**: Public (unauthenticated users), Prospective parents, General visitors

## 2️⃣ Route Information

- **Frontend Route**: `/contact`
- **Tenant-aware Route**: N/A (not implemented)
- **Access Level**: Public (no authentication required)

## 3️⃣ Completed Functionalities

- ✅ **Contact form submission** - Fields include:
  - Name (required)
  - Email (required, validated)
  - Phone (optional)
  - Message (optional)
- ✅ **Form validation** - Client-side validation using Zod schema
- ✅ **Real-time validation** - onChange validation mode
- ✅ **Server-side error handling** - Maps backend field errors to form
- ✅ **Toast notifications** - Success and error feedback
- ✅ **Form reset** - Clears form after successful submission
- ✅ **Loading states** - Button disabled during submission

## 4️⃣ API Integrations

### POST `/api/public/contact`

- **Purpose**: Submits contact form data to backend
- **Triggered**: On form submission
- **Payload**:
  - `name` - Sender's name (required)
  - `email` - Sender's email (required, validated)
  - `phone` - Phone number (optional, empty string if not provided)
  - `message` - Message content (optional, empty string if not provided)
- **Response**: Success confirmation
- **Success**: Shows success toast and resets form
- **Error**: Displays field-specific or general error messages

## 5️⃣ User Actions Supported

### Primary Actions

- **Fill Form** - Enter contact details and message
- **Submit Form** - Send message to school
- **View Validation Errors** - Real-time field validation feedback
- **Retry Submission** - Re-submit after correcting errors

### Planned Actions (Not Implemented)

- **File attachment** - Attach documents or images
- **Subject selection** - Dropdown for inquiry type
- **Preferred contact method** - Email vs phone preference
- **Schedule callback** - Request specific time for callback
- **FAQ reference** - Link to FAQ before submitting

## 6️⃣ UI Components Used

### Main Components

- **Card** - Container for contact form
- **Form** - Form wrapper with validation
- **FormField** - Individual field containers
- **FormLabel** - Field labels
- **FormControl** - Input control wrapper
- **FormMessage** - Validation error display
- **Input** - Text and email input fields
- **Textarea** - Multi-line message input
- **Button** - Submit button
- **ToastProvider** - Toast notification context

### Layout

- **Centered Layout** - Centered on screen with min-height
- **Full-width Card** - Max-width 3xl, then lg for form
- **Grid Layout** - Single column form grid
- **Background** - White background

### Form Fields

- Name field with placeholder
- Email field with type="email"
- Phone field with formatted placeholder
- Message textarea for longer content

## 7️⃣ Notes / Future Enhancements

### Known Limitations

- No CAPTCHA/spam protection
- No file attachment support
- No subject/category selection
- No inquiry status tracking
- No confirmation email to sender
- No character limits on message
- Phone validation not strict (accepts any format)

### Planned Features

#### Form Enhancements

- **CAPTCHA** - Google reCAPTCHA or hCaptcha for spam prevention
- **Subject Selection** - Dropdown for:
  - General Inquiry
  - Admission Information
  - Technical Support
  - Feedback/Complaints
  - Other
- **File Upload** - Attach documents (ID, certificates, etc.)
- **Rich Text Editor** - Formatting options for message
- **Character Counter** - Show remaining characters for fields
- **Phone Validation** - Format validation with country code support
- **Preferred Contact Method** - Radio buttons for email/phone preference
- **Contact Time Preference** - When to contact back

#### User Experience

- **Success Page** - Redirect to thank you page after submission
- **Reference Number** - Provide tracking number for inquiry
- **Estimated Response Time** - Show expected response timeframe
- **Alternative Contact Methods** - Display phone, email, address
- **Office Hours** - Show when office is available
- **FAQ Section** - Common questions before submitting
- **Live Chat** - Real-time support option

#### Backend Integration

- **Auto-reply Email** - Send confirmation email to sender
- **Notification** - Email/SMS to admin on new inquiry
- **Ticket System** - Create support ticket from submission
- **CRM Integration** - Add contact to school CRM
- **Status Tracking** - Allow users to check inquiry status with reference number

#### Accessibility & Validation

- **Required Field Indicators** - Clear visual marking
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Error Summary** - List all errors at top of form
- **Input Masks** - Format phone numbers automatically
- **Email Verification** - Check email format validity

### Technical Notes

- Uses React Hook Form for form state management
- Zod schema validation for all fields
- Email validation ensures valid format
- Optional fields converted to empty strings (backend compatibility)
- Toast notifications with unique IDs prevent duplicates
- Form reset clears all fields after successful submission
- onChange validation mode for real-time feedback
- Error mapping supports field-specific and general errors
- Uses public API endpoint (no authentication required)
- ToastProvider wrapper required for toast functionality

### Contact Form Schema

```typescript
{
  name: string (min 1 char),
  email: string (valid email),
  phone: string | "" (optional),
  message: string | "" (optional)
}
```

### Error Handling Strategy

1. **Network Error** - Shows "Unable to reach server" toast
2. **Validation Errors** - Maps to specific form fields
3. **General Errors** - Shows error message from backend
4. **Unknown Errors** - Shows generic "unexpected error" toast

### Security Considerations

- Implement rate limiting on backend
- Add CAPTCHA to prevent spam/bots
- Sanitize input on backend
- Validate email format on backend
- Implement IP-based throttling
- Log submissions for abuse detection
- Consider honeypot field for bot detection
