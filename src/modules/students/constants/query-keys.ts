export const STUDENTS_PAGE_SIZE = 10;

export const studentQueryKeys = {
  all: ["students"] as const,
  lists: () => [...studentQueryKeys.all, "list"] as const,
  list: (query: {
    search?: string;
    classId?: string;
    page?: number;
    pageSize?: number;
  }) => [...studentQueryKeys.lists(), query] as const,
  details: () => [...studentQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...studentQueryKeys.details(), id] as const,
};
