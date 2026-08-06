import type {
  HomeworkStatus,
  HomeworkType,
  SubmissionStatus,
} from "@/modules/homework/types";

export const HOMEWORK_TYPE_LABELS: Record<HomeworkType, string> = {
  HOMEWORK: "Homework",
  ASSIGNMENT: "Assignment",
};

export const HOMEWORK_STATUS_LABELS: Record<HomeworkStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
};

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: "Not submitted",
  SUBMITTED: "Submitted",
  LATE: "Late",
  REVIEWED: "Reviewed",
  RETURNED: "Returned",
};

export function homeworkStatusClass(status: HomeworkStatus): string {
  switch (status) {
    case "DRAFT":
      return "rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700";
    case "PUBLISHED":
      return "rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700";
    case "CLOSED":
      return "rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800";
    default:
      return "rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700";
  }
}

export function submissionStatusClass(status: SubmissionStatus): string {
  switch (status) {
    case "NOT_SUBMITTED":
      return "rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600";
    case "SUBMITTED":
      return "rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700";
    case "LATE":
      return "rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700";
    case "REVIEWED":
      return "rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700";
    case "RETURNED":
      return "rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700";
    default:
      return "rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600";
  }
}

export function formatDueAt(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function isOverdue(dueAt: string, status?: HomeworkStatus): boolean {
  if (status === "CLOSED") return false;
  return new Date(dueAt).getTime() < Date.now();
}
