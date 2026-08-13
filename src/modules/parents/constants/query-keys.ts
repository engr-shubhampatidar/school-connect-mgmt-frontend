export const PARENTS_PAGE_SIZE = 10;

export const parentQueryKeys = {
  all: ["parents"] as const,
  lists: () => [...parentQueryKeys.all, "list"] as const,
  list: (query: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => [...parentQueryKeys.lists(), query] as const,
  details: () => [...parentQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...parentQueryKeys.details(), id] as const,
};
