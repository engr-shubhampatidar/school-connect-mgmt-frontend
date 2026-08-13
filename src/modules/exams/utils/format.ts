import type { ExamStatus, ExamType } from "../types";

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  UNIT_TEST: "Unit Test",
  MIDTERM: "Midterm",
  FINAL: "Final",
  PRACTICAL: "Practical",
  OTHER: "Other",
};

export const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  RESULTS_PUBLISHED: "Published",
  CANCELLED: "Cancelled",
};

export function examStatusClass(status: ExamStatus): string {
  switch (status) {
    case "DRAFT":
      return "bg-slate-100 text-slate-700";
    case "SCHEDULED":
      return "bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";
    case "COMPLETED":
      return "bg-indigo-50 text-indigo-700";
    case "RESULTS_PUBLISHED":
      return "bg-green-50 text-green-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function formatClassLabel(
  name?: string | null,
  section?: string | null,
): string {
  if (!name) return "—";
  return section ? `${name}-${section}` : name;
}

export function formatPercent(value: number): string {
  return `${Number(value).toFixed(1)}%`;
}
