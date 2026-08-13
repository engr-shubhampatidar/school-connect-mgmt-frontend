export const PARENT_PORTAL_PAGE_SIZE = 10;

export const parentPortalQueryKeys = {
  all: ["parent-portal"] as const,
  me: () => [...parentPortalQueryKeys.all, "me"] as const,
  children: () => [...parentPortalQueryKeys.all, "children"] as const,
  child: (studentId: string) =>
    [...parentPortalQueryKeys.all, "child", studentId] as const,
  dashboard: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "dashboard"] as const,
  profile: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "profile"] as const,
  attendance: (studentId: string, params?: Record<string, unknown>) =>
    [...parentPortalQueryKeys.child(studentId), "attendance", params ?? {}] as const,
  attendanceMonthly: (
    studentId: string,
    params?: { year?: number; month?: number },
  ) =>
    [
      ...parentPortalQueryKeys.child(studentId),
      "attendance-monthly",
      params ?? {},
    ] as const,
  classInfo: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "class"] as const,
  timetable: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "timetable"] as const,
  announcements: (studentId: string, params?: Record<string, unknown>) =>
    [
      ...parentPortalQueryKeys.child(studentId),
      "announcements",
      params ?? {},
    ] as const,
  documents: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "documents"] as const,
  homework: (studentId: string, params?: Record<string, unknown>) =>
    [...parentPortalQueryKeys.child(studentId), "homework", params ?? {}] as const,
  homeworkDetail: (studentId: string, homeworkId: string) =>
    [
      ...parentPortalQueryKeys.child(studentId),
      "homework",
      homeworkId,
    ] as const,
  fees: (studentId: string, params?: Record<string, unknown>) =>
    [...parentPortalQueryKeys.child(studentId), "fees", params ?? {}] as const,
  feesSummary: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "fees-summary"] as const,
  feePayments: (studentId: string, params?: Record<string, unknown>) =>
    [
      ...parentPortalQueryKeys.child(studentId),
      "fee-payments",
      params ?? {},
    ] as const,
  exams: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "exams"] as const,
  examSchedule: (studentId: string) =>
    [...parentPortalQueryKeys.child(studentId), "exam-schedule"] as const,
  reportCard: (studentId: string, examId: string) =>
    [
      ...parentPortalQueryKeys.child(studentId),
      "report-card",
      examId,
    ] as const,
};
