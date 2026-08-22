"use client";

import { Card } from "@/components/ui/Card";
import { allocatedUsedRemaining } from "../utils";
import type { LeaveBalanceItem } from "../types";

export function LeaveBalanceCards({
  balances,
  casualLeave,
  sickLeave,
  totalUsedLeaves,
}: {
  balances?: LeaveBalanceItem[];
  casualLeave?: number;
  sickLeave?: number;
  totalUsedLeaves?: number;
}) {
  const casual = allocatedUsedRemaining(balances, "CASUAL");
  const sick = allocatedUsedRemaining(balances, "SICK");
  const casualRemaining = casualLeave ?? casual.remainingDays;
  const sickRemaining = sickLeave ?? sick.remainingDays;
  const usedTotal =
    totalUsedLeaves ?? casual.usedDays + sick.usedDays;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <p className="text-sm text-[#415A77]">Casual Leave</p>
        <p className="mt-1 text-3xl font-semibold text-[#1B263B]">
          {casualRemaining}
        </p>
        <p className="mt-2 text-xs text-slate-500">Remaining days</p>
      </Card>
      <Card>
        <p className="text-sm text-[#415A77]">Sick Leave</p>
        <p className="mt-1 text-3xl font-semibold text-[#1B263B]">
          {sickRemaining}
        </p>
        <p className="mt-2 text-xs text-slate-500">Remaining days</p>
      </Card>
      <Card>
        <p className="text-sm text-[#415A77]">Total Used Leaves</p>
        <p className="mt-1 text-3xl font-semibold text-[#1B263B]">
          {usedTotal}
        </p>
        <p className="mt-2 text-xs text-slate-500">Approved CL + SL days</p>
      </Card>
    </div>
  );
}
