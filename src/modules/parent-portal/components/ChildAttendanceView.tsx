"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { AttendanceStatusBadge } from "@/modules/attendance";
import { AttendanceSummary } from "@/modules/dashboard";
import { DataTableSkeleton } from "@/components/skeletons";
import {
  useChildAttendanceQuery,
  useChildMonthlyAttendanceQuery,
} from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildAttendanceView({
  studentId,
}: {
  studentId: string;
}) {
  const now = useMemo(() => new Date(), []);
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);

  const monthlyQuery = useChildMonthlyAttendanceQuery(studentId, {
    year,
    month,
  });
  const historyQuery = useChildAttendanceQuery(studentId);

  if (monthlyQuery.isLoading && historyQuery.isLoading) {
    return <PortalLoading rows={3} />;
  }

  if (monthlyQuery.error && historyQuery.error) {
    return (
      <PortalError
        message={formatErrorMessage(
          monthlyQuery.error,
          "Failed to load attendance",
        )}
        onRetry={() => {
          void monthlyQuery.refetch();
          void historyQuery.refetch();
        }}
      />
    );
  }

  const monthly = monthlyQuery.data;
  const history = historyQuery.data ?? [];

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Attendance"
        description="Monthly summary and attendance history (read-only)"
      />

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 sm:grid-cols-4">
          <Card>
            <div className="text-sm text-slate-500">Present</div>
            <div className="mt-2 text-2xl font-semibold text-[#021034]">
              {monthly?.present ?? "—"}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Absent</div>
            <div className="mt-2 text-2xl font-semibold text-[#021034]">
              {monthly?.absent ?? "—"}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Leave</div>
            <div className="mt-2 text-2xl font-semibold text-[#021034]">
              {monthly?.leave ?? "—"}
            </div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">This month</div>
            <div className="mt-2 text-2xl font-semibold text-[#021034]">
              {monthly?.percentage ?? 0}%
            </div>
          </Card>
        </div>
        <AttendanceSummary
          presentDays={monthly?.present ?? 0}
          absentDays={monthly?.absent ?? 0}
          monthlyPercentage={monthly?.percentage ?? 0}
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#021034]">
            Attendance history
          </h2>
          <div className="text-sm text-slate-500">
            {year}-{String(month).padStart(2, "0")} summary above
          </div>
        </div>

        {historyQuery.isLoading ? (
          <DataTableSkeleton
            rows={8}
            columns={[
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-20" },
            ]}
          />
        ) : historyQuery.error ? (
          <p className="text-sm text-slate-600">
            {formatErrorMessage(historyQuery.error, "Failed to load history")}
          </p>
        ) : history.length === 0 ? (
          <PortalEmpty title="No attendance records" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-slate-600">
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, idx) => (
                  <tr
                    key={`${row.date}-${idx}`}
                    className="border-t border-slate-100"
                  >
                    <td className="py-3 text-sm">
                      {new Date(row.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3">
                      <AttendanceStatusBadge
                        status={String(row.status || "").toUpperCase()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PortalPageShell>
  );
}
