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
  DOCUMENTS: "/admin/documents",
  DOCUMENTS_UPLOAD: "/admin/documents/upload",
  DOCUMENT_BY_ID: (id: string) => `/admin/documents/${id}`,
  EXAMS_DASHBOARD: "/admin/exams/dashboard",
  EXAMS: "/admin/exams",
  EXAM_BY_ID: (id: string) => `/admin/exams/${id}`,
  EXAM_STATUS: (id: string) => `/admin/exams/${id}/status`,
  EXAM_SCHEDULES: (examId: string) => `/admin/exams/${examId}/schedules`,
  EXAM_SCHEDULE_BY_ID: (examId: string, scheduleId: string) =>
    `/admin/exams/${examId}/schedules/${scheduleId}`,
  EXAM_MARKS: (examId: string) => `/admin/exams/${examId}/marks`,
  EXAM_RESULTS: (examId: string) => `/admin/exams/${examId}/results`,
  EXAM_RESULTS_GENERATE: (examId: string) =>
    `/admin/exams/${examId}/results/generate`,
  EXAM_RESULTS_PUBLISH: (examId: string) =>
    `/admin/exams/${examId}/results/publish`,
  EXAM_REPORT_CARD: (examId: string, studentUserId: string) =>
    `/admin/exams/${examId}/report-cards/${studentUserId}`,
  EXAM_CLASS_REPORT: (examId: string) => `/admin/exams/${examId}/class-report`,
};

export const TEACHER_API = {
  LOGIN: AUTH_API.LOGIN,
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
  ME: "/api/student/me",
  PROFILE: "/api/student/profile",
  ATTENDANCE: "/api/student/attendance",
  CHANGE_PASSWORD: "/api/student/auth/change-password",
  /** Admin-facing student profile by id */
  BY_ID: (id: string) => `/admin/students/${id}`,
  /** Update student (admin or class teacher) */
  UPDATE: (id: string) => `/students/${id}`,
  EXAMS: "/student/exams",
  EXAM_REPORT_CARD: (examId: string) => `/student/exams/${examId}/report-card`,
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
