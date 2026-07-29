export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const AUTH_API = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
};

export const PUBLIC_API = {
  CONTACT: "/public/contact",
  REGISTER_SCHOOL: "/auth/register-school",
};

/** Paths that must not send Authorization (exact or prefix with trailing match). */
export const PUBLIC_API_PATHS = [
  AUTH_API.LOGIN,
  AUTH_API.REFRESH,
  PUBLIC_API.REGISTER_SCHOOL,
  PUBLIC_API.CONTACT,
] as const;

export const ADMIN_API = {
  LOGIN: AUTH_API.LOGIN,
  DASHBOARD: "/admin/dashboard",
  STUDENTS: "/admin/students",
  TEACHERS: "/admin/teachers",
  CLASSES: "/admin/classes",
  CLASSES_WITH_TEACHER: "/admin/classes/with-class-teacher",
  SUBJECTS: "/admin/subjects",
  ANNOUNCEMENTS: "/admin/announcements",
  GRAPH: "/admin/attendance/graph",
  CLASS_DASHBOARD: "/admin/classes/dashboard",
};

export const TEACHER_API = {
  LOGIN: AUTH_API.LOGIN,
  ME: "/teacher/dashboard",
  DASHBOARD: "/teacher/dashboard",
  CLASS: "/teacher/class",
  PROFILE: (id: string) => `/admin/teachers/${id}`,
};

export const ATTENDANCE_API = {
  BASE: "/attendance",
  CLASS: (classId: string) => `/attendance/class/${classId}`,
  STUDENT: (studentId: string) => `/attendance/student/${studentId}`,
};

export const STUDENT_API = {
  PROFILE: (id: string) => `/admin/students/${id}`,
};

const routes = {
  BASE_URL,
  AUTH_API,
  PUBLIC_API,
  PUBLIC_API_PATHS,
  ADMIN_API,
  TEACHER_API,
  STUDENT_API,
};

export default routes;
