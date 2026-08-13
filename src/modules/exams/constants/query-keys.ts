export const EXAMS_PAGE_SIZE = 10;

export const examQueryKeys = {
  all: ["exams"] as const,
  dashboard: () => [...examQueryKeys.all, "dashboard"] as const,
  list: (q?: Record<string, unknown>) =>
    [...examQueryKeys.all, "list", q ?? {}] as const,
  detail: (id: string) => [...examQueryKeys.all, "detail", id] as const,
  schedules: (examId: string) =>
    [...examQueryKeys.all, "schedules", examId] as const,
  marks: (examId: string) => [...examQueryKeys.all, "marks", examId] as const,
  results: (examId: string, q?: Record<string, unknown>) =>
    [...examQueryKeys.all, "results", examId, q ?? {}] as const,
  reportCard: (examId: string, studentUserId: string) =>
    [...examQueryKeys.all, "report-card", examId, studentUserId] as const,
  classReport: (examId: string) =>
    [...examQueryKeys.all, "class-report", examId] as const,
  studentList: () => [...examQueryKeys.all, "student-list"] as const,
  studentSchedule: () => [...examQueryKeys.all, "student-schedule"] as const,
  studentReportCard: (examId: string) =>
    [...examQueryKeys.all, "student-report-card", examId] as const,
};
