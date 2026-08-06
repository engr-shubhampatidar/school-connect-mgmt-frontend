"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { AttendanceSummary } from "@/modules/dashboard";
import {
  useChildClassQuery,
  useChildDashboardQuery,
  useParentChildrenQuery,
} from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatClassLabel,
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

const QUICK_LINKS = [
  { label: "Attendance", path: "attendance" },
  { label: "Timetable", path: "timetable" },
  { label: "Homework", path: "homework" },
  { label: "Fees", path: "fees" },
  { label: "Exams", path: "exams" },
  { label: "Announcements", path: "announcements" },
] as const;

export default function ChildDashboardView({
  studentId,
}: {
  studentId: string;
}) {
  const childrenQuery = useParentChildrenQuery();
  const dashboardQuery = useChildDashboardQuery(studentId);
  const classQuery = useChildClassQuery(studentId);

  const linked = (childrenQuery.data ?? []).some((c) => c.id === studentId);
  const loading =
    childrenQuery.isLoading ||
    dashboardQuery.isLoading ||
    classQuery.isLoading;
  const error =
    childrenQuery.error || dashboardQuery.error || classQuery.error;

  if (loading) return <PortalLoading rows={4} />;

  if (!childrenQuery.isLoading && !linked) {
    return (
      <PortalError
        message="This student is not linked to your parent account."
        onRetry={() => void childrenQuery.refetch()}
      />
    );
  }

  if (error) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Failed to load child dashboard")}
        onRetry={() => {
          void dashboardQuery.refetch();
          void classQuery.refetch();
        }}
      />
    );
  }

  const data = dashboardQuery.data;
  const childMeta = (childrenQuery.data ?? []).find((c) => c.id === studentId);
  const classInfo = classQuery.data ?? data?.currentClass ?? null;
  const presentDays = data?.presentDays ?? 0;
  const absentDays = data?.absentDays ?? 0;
  const percentage = data?.attendancePercentage ?? 0;
  const timetable = data?.timetable ?? [];
  const announcements = data?.recentAnnouncements ?? [];

  return (
    <PortalPageShell>
      <PortalPageHeader
        title={
          data?.profile?.fullName ??
          childMeta?.fullName ??
          "Child dashboard"
        }
        description={`${formatClassLabel(
          classInfo?.name ?? childMeta?.className,
          classInfo?.section ?? childMeta?.section,
        )}${
          data?.profile?.studentCode || childMeta?.studentCode
            ? ` · ${data?.profile?.studentCode ?? childMeta?.studentCode}`
            : ""
        }`}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Attendance</div>
          <div className="mt-2 text-2xl font-semibold text-[#021034]">
            {percentage}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {presentDays} present · {absentDays} absent · {data?.leaveDays ?? 0}{" "}
            leave
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Class</div>
          <div className="mt-2 text-lg font-medium text-[#021034]">
            {formatClassLabel(classInfo?.name, classInfo?.section)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Documents</div>
          <div className="mt-2 text-2xl font-semibold text-[#021034]">
            {data?.documents?.count ?? 0}
          </div>
          <Link
            href={`/parent/children/${studentId}/documents`}
            className="mt-2 inline-block text-sm text-blue-700 hover:underline"
          >
            View documents
          </Link>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 overflow-hidden rounded-xl border border-[#D7E3FC] bg-white">
          <div className="border-b border-[#D7E3FC] px-6 py-4">
            <h2 className="text-lg font-semibold text-[#021034]">
              Class timetable (preview)
            </h2>
          </div>
          {timetable.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No timetable available.
            </div>
          ) : (
            timetable.slice(0, 6).map((item, index) => (
              <div
                key={`${item.subject}-${item.startTime}-${index}`}
                className="flex items-center justify-between border-b border-[#D7E3FC] px-6 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-[#021034]">
                    {item.subject ?? "Class"}
                  </p>
                  <p className="mt-1 text-sm text-[#737373]">
                    {item.startTime}
                    {item.endTime ? `–${item.endTime}` : ""}
                    {item.subjectTeacher
                      ? ` · ${item.subjectTeacher}`
                      : ""}
                  </p>
                </div>
                <div className="rounded-full border border-[#D7E3FC] bg-blue-50 px-3 py-1 text-xs font-semibold text-[#021034]">
                  {item.room ?? "—"}
                </div>
              </div>
            ))
          )}
          <div className="border-t border-[#D7E3FC] px-6 py-3">
            <Link href={`/parent/children/${studentId}/timetable`}>
              <Button variant="ghost">Full timetable</Button>
            </Link>
          </div>
        </div>

        <AttendanceSummary
          presentDays={presentDays}
          absentDays={absentDays}
          monthlyPercentage={percentage}
        />
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-[#021034]">
          Quick links
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.path}
              href={`/parent/children/${studentId}/${link.path}`}
            >
              <Button variant="ghost">{link.label}</Button>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#021034]">
            Recent announcements
          </h2>
          <Link href={`/parent/children/${studentId}/announcements`}>
            <Button variant="ghost">View all</Button>
          </Link>
        </div>
        {announcements.length === 0 ? (
          <PortalEmpty title="No recent announcements" />
        ) : (
          <div className="divide-y divide-[#D7E3FC]">
            {announcements.map((a) => (
              <div key={a.id} className="py-3">
                <div className="font-medium text-[#021034]">{a.title}</div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {a.body}
                </p>
                <div className="mt-1 text-xs text-slate-500">
                  {a.publishedAt
                    ? new Date(a.publishedAt).toLocaleString("en-IN")
                    : ""}
                  {a.authorName ? ` · ${a.authorName}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PortalPageShell>
  );
}
