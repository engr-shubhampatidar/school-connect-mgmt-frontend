"use client";
import React from "react";
import {
  getStudentMe,
  getAttendanceSummary,
  StudentDashboardSkeleton,
} from "@/modules/students";
import { useToast } from "@/components/ui/use-toast";
import { AttendanceSummary } from "@/modules/dashboard";
import DocumentsGrid from "@/modules/documents/components/DocumentsGrid";
import { ensureSessionReady } from "@/modules/auth";

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return Number(v);
  }
  return fallback;
}

export default function StudentDashboardPage() {
  const [me, setMe] = React.useState<Record<string, unknown> | null>(null);
  const [summary, setSummary] = React.useState<Record<string, unknown> | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        await ensureSessionReady();
        if (!mounted) return;
        const [meData, summaryData] = await Promise.all([
          getStudentMe(),
          getAttendanceSummary(),
        ]);
        if (!mounted) return;
        setMe(meData);
        setSummary(summaryData);
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: unknown }).message ?? "Failed to load")
            : "Failed to load";
        toastRef.current?.({
          title: "Error",
          description: message,
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const displayName =
    (typeof me?.fullName === "string" && me.fullName) ||
    (typeof me?.name === "string" && me.name) ||
    "Student";

  const presentDays = num(
    summary?.presentDays ?? summary?.present ?? summary?.presentCount,
    0,
  );
  const absentDays = num(
    summary?.absentDays ?? summary?.absent ?? summary?.absentCount,
    0,
  );
  const monthlyPercentage = num(
    summary?.monthlyPercentage ?? summary?.percentage ?? summary?.attendancePercentage,
    presentDays + absentDays > 0
      ? Math.round((presentDays / (presentDays + absentDays)) * 100)
      : 0,
  );

  const schedule = Array.isArray(me?.todaySchedule)
    ? (me.todaySchedule as Array<Record<string, unknown>>)
    : Array.isArray(summary?.todaySchedule)
      ? (summary.todaySchedule as Array<Record<string, unknown>>)
      : [];

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="p-6">
      <div>
        <section className="pl-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] lg:text-[24px] text-[#021034] font-[600]">
                Welcome, {displayName}
              </h1>
              <p className="mt-1 text-[12px] lg:text-sm text-[#737373]">
                View Your Attendance and Result updates.
              </p>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <div className="col-span-2 border border-[#D7E3FC] grid rounded-xl bg-white w-full mr-6">
            {schedule.length === 0 ? (
              <div className="px-6 py-10 text-sm text-slate-500 text-center">
                No schedule available for today.
              </div>
            ) : (
              schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-[8px] py-[16px] lg:px-6 lg:py-6 border-b border-[#D7E3FC] last:border-b-0"
                >
                  <div className="space-y-2">
                    <p className="font-medium text-[#021034]">
                      {String(item.subject ?? item.title ?? "Class")}
                    </p>
                    <div className="flex items-center gap-2 lg:gap-4 text-sm text-[#737373]">
                      <div className="flex items-center gap-1">
                        <span aria-hidden>⏱</span>
                        <span>
                          {String(item.startTime ?? item.time ?? "-")}
                          {item.endTime ? `–${String(item.endTime)}` : ""}
                        </span>
                      </div>
                      {item.teacher || item.teacherName ? (
                        <div className="flex items-center gap-1">
                          <span aria-hidden>👥</span>
                          <span>
                            {String(item.teacher ?? item.teacherName)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-full border border-[#D7E3FC] bg-blue-50 px-4 py-1 text-xs font-semibold text-[#021034]">
                    {String(item.room ?? item.location ?? "—")}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="w-full max-w-full flex justify-center items-center">
            <AttendanceSummary
              presentDays={presentDays}
              absentDays={absentDays}
              monthlyPercentage={monthlyPercentage}
            />
          </div>
        </div>

        <div className="w-full min-w-full rounded-xl border border-[#D7E3FC] bg-white overflow-hidden mt-6">
          <div className="flex items-start justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#021034]">
                Recent Updates
              </h2>
              <p className="text-sm text-[#737373]">
                Check complete update at same time.
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-[#737373] hover:text-blue-600 transition"
            >
              View all activity
            </button>
          </div>
          <div className="border-t border-[#D7E3FC]" />
          <div className="px-6 py-8 text-sm text-slate-500 text-center">
            No recent updates yet.
          </div>
        </div>

        <DocumentsGrid />
      </div>
    </div>
  );
}
