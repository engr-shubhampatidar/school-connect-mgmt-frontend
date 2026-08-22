import type { LeaveStatus, LeaveType, TeacherLeaveType } from "./types";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  CASUAL: "Casual Leave",
  SICK: "Sick Leave",
  EMERGENCY: "Emergency",
  MEDICAL: "Medical",
  OTHER: "Other",
};

export const TEACHER_LEAVE_TYPE_OPTIONS: {
  id: TeacherLeaveType;
  name: string;
}[] = [
  { id: "CASUAL", name: "Casual Leave (CL)" },
  { id: "SICK", name: "Sick Leave (SL)" },
];

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function leaveStatusClass(status: LeaveStatus): string {
  switch (status) {
    case "APPROVED":
      return "rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700";
    case "REJECTED":
      return "rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700";
    default:
      return "rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800";
  }
}

export function countInclusiveDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = Date.parse(`${startDate.slice(0, 10)}T00:00:00Z`);
  const end = Date.parse(`${endDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.floor((end - start) / 86_400_000) + 1;
}

export function formatLeaveDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function remainingForType(
  balances: { leaveType: LeaveType; remainingDays: number }[] | undefined,
  leaveType: LeaveType,
): number {
  return balances?.find((item) => item.leaveType === leaveType)?.remainingDays ?? 0;
}

export function allocatedUsedRemaining(
  balances: {
    leaveType: LeaveType;
    allocatedDays: number;
    usedDays: number;
    remainingDays: number;
  }[] | undefined,
  leaveType: LeaveType,
) {
  const item = balances?.find((entry) => entry.leaveType === leaveType);
  return {
    allocatedDays: item?.allocatedDays ?? 0,
    usedDays: item?.usedDays ?? 0,
    remainingDays: item?.remainingDays ?? 0,
  };
}
