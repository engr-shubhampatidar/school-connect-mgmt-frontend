"use client";

import { Card } from "@/components/ui/Card";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { LEAVE_TYPE_LABELS, formatLeaveDate } from "../utils";
import type { LeaveSummary } from "../types";

export function LeaveHistoryTable({
  items,
  emptyLabel = "No leave requests yet.",
}: {
  items: LeaveSummary[];
  emptyLabel?: string;
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FAFC] text-left text-[#415A77]">
            <tr>
              <th className="px-4 py-3 font-medium">Teacher</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} className="border-t border-[#F1F5F9]">
                  <td className="px-4 py-3">{row.applicantName || "—"}</td>
                  <td className="px-4 py-3">
                    {LEAVE_TYPE_LABELS[row.leaveType] ?? row.leaveType}
                  </td>
                  <td className="px-4 py-3">
                    {formatLeaveDate(row.startDate)} – {formatLeaveDate(row.endDate)}
                  </td>
                  <td className="px-4 py-3">
                    <LeaveStatusBadge status={row.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
