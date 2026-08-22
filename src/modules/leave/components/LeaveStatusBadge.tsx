"use client";

import { LEAVE_STATUS_LABELS, leaveStatusClass } from "../utils";
import type { LeaveStatus } from "../types";

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  return <span className={leaveStatusClass(status)}>{LEAVE_STATUS_LABELS[status]}</span>;
}
