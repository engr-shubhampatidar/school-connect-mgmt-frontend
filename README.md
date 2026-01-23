# School Connect Management System

A comprehensive school management system built with Next.js, featuring role-based authentication and route protection for Admins, Teachers, and Students.

## 🔐 Authentication & Security

This application implements robust authentication and authorization:

- **Role-Based Access Control** - Separate authentication flows for Admin, Teacher, and Student
- **Protected Routes** - All routes are protected with role-specific AuthGuards
- **Token-Based Security** - JWT tokens stored in localStorage with automatic expiration handling
- **Session Management** - Persistent sessions across page refreshes with secure logout

### Documentation

- 📘 [**SUMMARY.md**](./SUMMARY.md) - Complete overview and deployment guide
- 📋 [**TESTING_REPORT.md**](./TESTING_REPORT.md) - Detailed testing documentation and analysis
- 🐛 [**BUG_REPORT.md**](./BUG_REPORT.md) - Known issues and vulnerability assessment
- 👨‍💻 [**DEVELOPER_GUIDE.md**](./DEVELOPER_GUIDE.md) - Quick reference for developers

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/          # Admin portal routes
│   │   ├── layout.tsx  # Admin auth protection
│   │   └── login/      # Admin login
│   ├── teacher/        # Teacher portal routes
│   │   ├── layout.tsx  # Teacher auth protection
│   │   └── login/      # Teacher login
│   └── student/        # Student portal routes
│       ├── layout.tsx  # Student auth protection
│       └── login/      # Student login
├── components/
│   ├── admin/          # Admin-specific components
│   ├── teacher/        # Teacher-specific components
│   └── student/        # Student-specific components
└── lib/
    ├── auth.ts         # Authentication utilities
    ├── axios.ts        # API client configuration
    └── api-routes.ts   # API endpoint definitions
```

## 🔑 Login Credentials

Access different portals with role-specific credentials:

- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Teacher Portal**: [http://localhost:3000/teacher/login](http://localhost:3000/teacher/login)
- **Student Portal**: [http://localhost:3000/student/login](http://localhost:3000/student/login)

## 🚀 Features

- ✅ Role-based authentication (Admin/Teacher/Student)
- ✅ Protected routes with automatic redirects
- ✅ Token-based API authentication
- ✅ Session persistence
- ✅ Secure logout functionality
- ✅ Loading states during auth verification
- ✅ Comprehensive error handling (401/403)

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🌐 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📝 Recent Updates

### Login & Route Protection (January 2026)
- Implemented comprehensive authentication system
- Added role-based route protection
- Created AuthGuard components for all roles
- Enhanced error handling and user feedback
- Complete documentation and testing reports

For detailed information, see [SUMMARY.md](./SUMMARY.md).

