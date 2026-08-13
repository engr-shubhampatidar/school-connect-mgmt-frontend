export const HOMEWORK_PAGE_SIZE = 10;

export const homeworkQueryKeys = {
  all: ["homework"] as const,
  teacherLists: () => [...homeworkQueryKeys.all, "teacher-list"] as const,
  teacherList: (q?: Record<string, unknown>) =>
    [...homeworkQueryKeys.teacherLists(), q ?? {}] as const,
  adminLists: () => [...homeworkQueryKeys.all, "admin-list"] as const,
  adminList: (q?: Record<string, unknown>) =>
    [...homeworkQueryKeys.adminLists(), q ?? {}] as const,
  studentLists: () => [...homeworkQueryKeys.all, "student-list"] as const,
  studentList: (q?: Record<string, unknown>) =>
    [...homeworkQueryKeys.studentLists(), q ?? {}] as const,
  detail: (id: string) => [...homeworkQueryKeys.all, "detail", id] as const,
  studentDetail: (id: string) =>
    [...homeworkQueryKeys.all, "student-detail", id] as const,
  submissions: (id: string, q?: Record<string, unknown>) =>
    [...homeworkQueryKeys.all, "submissions", id, q ?? {}] as const,
};
