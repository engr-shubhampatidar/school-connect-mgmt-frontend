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
  PARENTS: "/admin/parents",
  PARENT_BY_ID: (id: string) => `/admin/parents/${id}`,
  PARENT_CHILDREN: (id: string) => `/admin/parents/${id}/children`,
  PARENT_UNLINK_CHILD: (id: string, studentId: string) =>
    `/admin/parents/${id}/children/${studentId}`,
  CLASSES: "/admin/classes",
  CLASSES_WITH_TEACHER: "/admin/classes/with-class-teacher",
  SUBJECTS: "/admin/subjects",
  ANNOUNCEMENTS: "/admin/announcements",
  GRAPH: "/admin/attendance/graph",
  SCHOOL_SETTINGS: "/admin/schools/settings",
  SCHOOL_LOCATION: "/admin/schools/settings/location",
  CLASS_DASHBOARD: "/admin/classes/dashboard",
  DOCUMENTS: "/admin/documents",
  DOCUMENTS_UPLOAD: "/admin/documents/upload",
  DOCUMENT_BY_ID: (id: string) => `/admin/documents/${id}`,
  HOMEWORK: "/admin/homework",
  HOMEWORK_BY_ID: (id: string) => `/admin/homework/${id}`,
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
  FEES_DASHBOARD: "/admin/fees/dashboard",
  FEES_REPORTS: "/admin/fees/reports",
  FEE_CATEGORIES: "/admin/fees/categories",
  FEE_CATEGORY_BY_ID: (id: string) => `/admin/fees/categories/${id}`,
  FEE_STRUCTURES: "/admin/fees/structures",
  FEE_STRUCTURE_BY_ID: (id: string) => `/admin/fees/structures/${id}`,
  FEE_CLASS_POLICIES: "/admin/fees/class-policies",
  FEE_CLASS_POLICY_BY_ID: (id: string) => `/admin/fees/class-policies/${id}`,
  FEE_CLASS_POLICY_BY_CLASS: "/admin/fees/class-policies/by-class",
  STUDENT_FEE_DETAIL: (studentUserId: string) =>
    `/admin/fees/students/${studentUserId}/fees`,
  FEE_ASSIGNMENTS: "/admin/fees/assignments",
  FEE_ASSIGNMENT_BY_ID: (id: string) => `/admin/fees/assignments/${id}`,
  FEE_ASSIGNMENTS_BULK: "/admin/fees/assignments/bulk",
  FEE_ASSIGNMENTS_PREVIEW: "/admin/fees/assignments/preview",
  FEE_ASSIGNMENTS_PACKAGE: "/admin/fees/assignments/package",
  FEE_ASSIGNMENTS_BULK_PACKAGE: "/admin/fees/assignments/bulk-package",
  FEE_ASSIGNMENT_TRANSPORT: (id: string) =>
    `/admin/fees/assignments/${id}/transport`,
  FEE_ASSIGNMENT_OPT_OUT: (id: string) =>
    `/admin/fees/assignments/${id}/opt-out`,
  FEE_ASSIGNMENT_DISCOUNT: (id: string) =>
    `/admin/fees/assignments/${id}/discount`,
  FEE_ASSIGNMENT_WAIVE: (id: string) => `/admin/fees/assignments/${id}/waive`,
  FEE_PAYMENTS: "/admin/fees/payments",
  FEE_PAYMENT_COLLECT: "/admin/fees/payments/collect",
  FEE_PAYMENT_BY_ID: (id: string) => `/admin/fees/payments/${id}`,
  FEE_PAYMENT_RECEIPT: (id: string) => `/admin/fees/payments/${id}/receipt`,
};

export const TEACHER_API = {
  LOGIN: AUTH_API.LOGIN,
  DASHBOARD: "/teacher/dashboard",
  CLASS: "/teacher/class",
  PROFILE: (id: string) => `/admin/teachers/${id}`,
  MY_PROFILE: "/teacher/myprofile",
  ATTENDANCE_CONTEXT: "/teacher/attendance/context",
  ATTENDANCE_TODAY: "/teacher/attendance/today",
  ATTENDANCE_HISTORY: "/teacher/attendance/history",
  CHECK_IN: "/teacher/check-in",
  CHECK_OUT: "/teacher/check-out",
  HOMEWORK: "/teacher/homework",
  HOMEWORK_BY_ID: (id: string) => `/teacher/homework/${id}`,
};

export const ATTENDANCE_API = {
  BASE: "/attendance",
  CLASS: (classId: string) => `/attendance/class/${classId}`,
  STUDENT: (studentId: string) => `/attendance/student/${studentId}`,
};

export const STUDENT_API = {
  ME: "/student/me",
  PROFILE: "/student/profile",
  ATTENDANCE: "/student/attendance",
  CHANGE_PASSWORD: "/auth/change-password",
  /** Admin-facing student profile by id */
  BY_ID: (id: string) => `/admin/students/${id}`,
  /** Update student (admin or class teacher) */
  UPDATE: (id: string) => `/students/${id}`,
  DASHBOARD: "/student/dashboard",
  TIMETABLE: "/student/timetable",
  DOCUMENTS: "/student/documents",
  DOCUMENTS_UPLOAD: "/student/documents/upload",
  ANNOUNCEMENTS: "/student/class/announcements",
  ATTENDANCE_MONTHLY: "/student/attendance/monthly",
  HOMEWORK: "/student/homework",
  HOMEWORK_BY_ID: (id: string) => `/student/homework/${id}`,
  HOMEWORK_SUBMIT: (id: string) => `/student/homework/${id}/submissions`,
  EXAMS: "/student/exams",
  EXAM_REPORT_CARD: (examId: string) => `/student/exams/${examId}/report-card`,
  FEES: "/student/fees",
  FEES_SUMMARY: "/student/fees/summary",
  FEE_PAYMENTS: "/student/fees/payments",
  FEE_PAYMENT_RECEIPT: (id: string) => `/student/fees/payments/${id}/receipt`,
  EXAMS_SCHEDULE: "/student/exams/schedule",
};

export const PARENT_API = {
  ME: "/parent/me",
  CHILDREN: "/parent/children",
  CHILD_DASHBOARD: (id: string) => `/parent/children/${id}/dashboard`,
  CHILD_PROFILE: (id: string) => `/parent/children/${id}/profile`,
  CHILD_ATTENDANCE: (id: string) => `/parent/children/${id}/attendance`,
  CHILD_ATTENDANCE_MONTHLY: (id: string) =>
    `/parent/children/${id}/attendance/monthly`,
  CHILD_CLASS: (id: string) => `/parent/children/${id}/class`,
  CHILD_TIMETABLE: (id: string) => `/parent/children/${id}/timetable`,
  CHILD_ANNOUNCEMENTS: (id: string) => `/parent/children/${id}/announcements`,
  CHILD_DOCUMENTS: (id: string) => `/parent/children/${id}/documents`,
  CHILD_HOMEWORK: (id: string) => `/parent/children/${id}/homework`,
  CHILD_HOMEWORK_BY_ID: (id: string, hwId: string) =>
    `/parent/children/${id}/homework/${hwId}`,
  CHILD_FEES: (id: string) => `/parent/children/${id}/fees`,
  CHILD_FEES_SUMMARY: (id: string) => `/parent/children/${id}/fees/summary`,
  CHILD_FEE_PAYMENTS: (id: string) => `/parent/children/${id}/fees/payments`,
  CHILD_EXAMS: (id: string) => `/parent/children/${id}/exams`,
  CHILD_EXAMS_SCHEDULE: (id: string) => `/parent/children/${id}/exams/schedule`,
  CHILD_REPORT_CARD: (id: string, examId: string) =>
    `/parent/children/${id}/exams/${examId}/report-card`,
};

const routes = {
  BASE_URL,
  AUTH_API,
  PUBLIC_API,
  PUBLIC_API_PATHS,
  ADMIN_API,
  TEACHER_API,
  STUDENT_API,
  PARENT_API,
};

export default routes;
