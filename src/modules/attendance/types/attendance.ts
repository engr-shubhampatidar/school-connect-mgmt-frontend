/** Shared attendance record shapes used across student/teacher history UIs. */
export type AttendanceRecord = {
  date?: string;
  status?: string;
  attendance?: string;
  students?: Array<{ studentId?: string; status?: string } | Record<string, unknown>>;
  id?: string;
  [k: string]: unknown;
};

/** Alias used by class-day history views. */
export type AttendanceHistoryRecord = AttendanceRecord;
