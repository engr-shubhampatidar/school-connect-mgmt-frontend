export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";

export const PUBLIC_API = {
  CONTACT: "/api/public/contact",
  REGISTER_SCHOOL: "/api/public/register-school",
};

export const ADMIN_API = {
  LOGIN: "/api/admin/auth/login",
  DASHBOARD: "/api/admin/dashboard",
  STUDENTS: "/api/admin/students",
  TEACHERS: "/api/admin/teachers",
  CLASSES: "/api/admin/classes",
  CLASSES_WITH_TEACHER: "/api/admin/classes/with-class-teacher",
  SUBJECTS: "/api/admin/subjects",
  ANNOUNCEMENTS: "/api/admin/announcements",
};

export const TEACHER_API = {
  LOGIN: "/api/teacher/auth/login",
  ME: "/api/teacher/dashboard",
  CLASS: "/api/teacher/class",
};

export const ATTENDANCE_API = {
  BASE: "/api/attendance",
  CLASS: (classId: string) => `/api/attendance/class/${classId}`,
  STUDENT: (studentId: string) => `/api/attendance/student/${studentId}`,
};

const routes = { BASE_URL, PUBLIC_API, ADMIN_API };

export default routes;
