"use client";

import Card from "@/components/ui/Card";
import { useChildTimetableQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildTimetableView({
  studentId,
}: {
  studentId: string;
}) {
  const { data, isLoading, error, refetch } = useChildTimetableQuery(studentId);
  const entries = data ?? [];

  if (isLoading) return <PortalLoading rows={4} />;
  if (error) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Failed to load timetable")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Timetable"
        description="Class schedule for this student"
      />

      {entries.length === 0 ? (
        <PortalEmpty
          title="No timetable available"
          description="The class may not have a timetable set yet."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#D7E3FC] bg-white">
          {entries.map((item, index) => (
            <div
              key={`${item.subject}-${item.startTime}-${index}`}
              className="flex items-center justify-between border-b border-[#D7E3FC] px-6 py-4 last:border-b-0"
            >
              <div className="space-y-1">
                <p className="font-medium text-[#021034]">
                  {item.subject ?? "Class"}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#737373]">
                  <span>
                    {item.startTime}
                    {item.endTime ? `–${item.endTime}` : ""}
                  </span>
                  {item.subjectTeacher ? (
                    <span>{item.subjectTeacher}</span>
                  ) : null}
                </div>
              </div>
              <div className="rounded-full border border-[#D7E3FC] bg-blue-50 px-4 py-1 text-xs font-semibold text-[#021034]">
                {item.room ?? "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.length > 0 ? (
        <Card className="mt-4">
          <p className="text-sm text-slate-600">
            Showing {entries.length} period
            {entries.length === 1 ? "" : "s"} for the assigned class.
          </p>
        </Card>
      ) : null}
    </PortalPageShell>
  );
}
