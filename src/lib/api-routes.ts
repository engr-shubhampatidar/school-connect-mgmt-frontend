export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const PUBLIC_API = {
  CONTACT: "/public/contact",
  REGISTER_SCHOOL: "/auth/register-school",
};

export const ADMIN_API = {
  LOGIN: "/auth/login",
  DASHBOARD: "/admin/dashboard",
  STUDENTS: "/admin/students",
  TEACHERS: "/admin/teachers",
  CLASSES: "/admin/classes",
  CLASSES_WITH_TEACHER: "/admin/classes/with-class-teacher",
  SUBJECTS: "/admin/subjects",
  ANNOUNCEMENTS: "/admin/announcements",
  GRAPH: "/admin/attendance/graph",
};

export const TEACHER_API = {
  LOGIN: "/teacher/auth/login",
  ME: "/teacher/dashboard",
  CLASS: "/teacher/class",
};

export const ATTENDANCE_API = {
  BASE: "/attendance",
  CLASS: (classId: string) => `/attendance/class/${classId}`,
  STUDENT: (studentId: string) => `/attendance/student/${studentId}`,
};

const routes = { BASE_URL, PUBLIC_API, ADMIN_API };

export default routes;
