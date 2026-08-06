export const FEES_PAGE_SIZE = 10;

export const feeQueryKeys = {
  all: ["fees"] as const,
  dashboard: () => [...feeQueryKeys.all, "dashboard"] as const,
  categories: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "categories", query ?? {}] as const,
  structures: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "structures", query ?? {}] as const,
  assignments: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "assignments", query ?? {}] as const,
  payments: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "payments", query ?? {}] as const,
  reports: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "reports", query ?? {}] as const,
  studentFees: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "student", "fees", query ?? {}] as const,
  studentPayments: (query?: Record<string, unknown>) =>
    [...feeQueryKeys.all, "student", "payments", query ?? {}] as const,
};
