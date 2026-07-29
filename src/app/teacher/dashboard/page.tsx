"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../components/ui/Card";
import { useToast } from "../../../components/ui/use-toast";
import {
  getTeacherDashboard,
  type AssignedClass,
  type AssignedSubject,
  type TodayScheduleItem,
} from "../../../lib/teacherApi";
import { ensureSessionReady, getAccessToken, getActiveRole, getUser } from "../../../lib/auth";
import StatCard from "@/components/admin/StatCard";
import { Users, ClipboardCheck, MailQuestionMark } from "lucide-react";
import AssignedSubjectsCard from "../dashboard/Components/AssignedSubjectsCard";
import TodayScheduleCard from "../dashboard/Components/TodayScheduleCard";

function formatTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
}

function getScheduleStatus(
  startTime: string,
  endTime: string,
): "completed" | "current" | "upcoming" {
  const now = new Date();
  const [sh, sm, ss] = startTime.split(":").map(Number);
  const [eh, em, es] = endTime.split(":").map(Number);
  const start = new Date(now);
  start.setHours(sh || 0, sm || 0, ss || 0, 0);
  const end = new Date(now);
  end.setHours(eh || 0, em || 0, es || 0, 0);
  if (now >= end) return "completed";
  if (now >= start && now < end) return "current";
  return "upcoming";
}

function formatTodayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDayLabel(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function mapSubjects(subjects: AssignedSubject[]) {
  return subjects.map((s) => ({
    classSection: `${s.class}-${s.section}`,
    subjectName: s.subject,
    studentCount: s.totalStudents,
  }));
}

function mapSchedule(schedule: TodayScheduleItem[]) {
  return schedule.map((item) => ({
    time: formatTime(item.startTime),
    title: item.subject,
    subtitle: `Class ${item.class}-${item.section}${item.room ? ` Room-${item.room}` : ""}`,
    status: getScheduleStatus(item.startTime, item.endTime),
  }));
}

function getNextClass(schedule: TodayScheduleItem[]): string {
  const next =
    schedule.find(
      (item) => getScheduleStatus(item.startTime, item.endTime) === "current",
    ) ??
    schedule.find(
      (item) => getScheduleStatus(item.startTime, item.endTime) === "upcoming",
    );
  return next?.subject ?? "—";
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [assignedClass, setAssignedClass] = useState<AssignedClass | null>(
    null,
  );
  const [assignedSubjects, setAssignedSubjects] = useState<AssignedSubject[]>(
    [],
  );
  const [todaySchedule, setTodaySchedule] = useState<TodayScheduleItem[]>([]);

  const toastRef = React.useRef(toast);
  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      await ensureSessionReady();
      if (!mounted) return;

      if (!getAccessToken() || getActiveRole() !== "teacher") {
        return;
      }

      const stored = getUser<{ name?: string }>("teacher");
      if (stored?.name) setTeacherName(stored.name);

      try {
        const data = await getTeacherDashboard();
        if (!mounted) return;

        setAssignedClass(data.assignedClass);
        setAssignedSubjects(data.assignedSubjects);
        setTodaySchedule(data.todaySchedule);

        const nameFromSubjects = data.assignedSubjects.find(
          (s) => s.teacherName,
        )?.teacherName;
        if (nameFromSubjects) setTeacherName(nameFromSubjects);
      } catch (err: unknown) {
        let message = "Error";
        if (typeof err === "object" && err !== null && "message" in err) {
          const maybeMessage = (err as { message?: unknown }).message;
          if (typeof maybeMessage === "string") message = maybeMessage;
        }
        toastRef.current?.({
          title: "Unable to load",
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
  }, [router]);

  if (loading) {
    const rows = Array.from({ length: 6 }).map((_, i) => (
      <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-slate-50" : ""}`}>
        <td className="px-6 py-4">
          <div className="h-4 w-12 rounded bg-slate-200" />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-200" />
            <div className="h-4 w-40 rounded bg-slate-300" />
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-end">
            <div className="h-8 w-32 rounded bg-slate-300" />
          </div>
        </td>
      </tr>
    ));

    return (
      <div className="p-4 pb-28 space-y-4 animate-pulse" aria-hidden>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-7 w-48 rounded bg-slate-300" />
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="h-3 w-32 rounded bg-slate-200" />
              <div className="h-9 w-36 rounded bg-slate-300" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-6 w-64 rounded bg-slate-300" />
                  <div className="h-4 w-40 rounded bg-slate-200" />
                </div>
                <div className="text-right space-y-2">
                  <div className="h-6 w-20 rounded bg-slate-200 mx-auto" />
                  <div className="h-4 w-32 rounded bg-slate-300 mx-auto" />
                </div>
              </div>

              <div className="mt-6 rounded-b-md border-t-2 border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-slate-200" />
                  <div className="h-4 w-48 rounded bg-slate-200" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-20 rounded bg-slate-200" />
                  <div className="h-9 w-36 rounded bg-slate-300" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
              <div className="flex items-start justify-between p-6">
                <div className="space-y-2">
                  <div className="h-5 w-36 rounded bg-slate-300" />
                  <div className="h-4 w-56 rounded bg-slate-200" />
                </div>
                <div className="h-9 w-56 rounded-lg bg-slate-200" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-medium">
                        <div className="h-3 w-20 rounded bg-slate-200" />
                      </th>
                      <th className="px-6 py-3 font-medium">
                        <div className="h-3 w-28 rounded bg-slate-200" />
                      </th>
                      <th className="px-6 py-3 font-medium text-right">
                        <div className="h-3 w-36 rounded bg-slate-200 mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="h-6 w-20 rounded bg-slate-300" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-300" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 w-36 rounded bg-slate-300" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="h-3 w-16 rounded bg-slate-200" />
                      <div className="h-3 w-32 rounded bg-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasClass = Boolean(assignedClass?.classId);
  const attendanceDone =
    assignedClass?.attendanceStatus?.toUpperCase() === "COMPLETED";
  const totalStudents = assignedClass?.totalStudents ?? 0;
  const classLabel = hasClass
    ? `${assignedClass!.class}${assignedClass!.section ? `-${assignedClass!.section}` : ""}`
    : null;

  return (
    <div className="p-4 space-y-4">
      <section className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] text-[#021034] font-[600]">
              Welcome back, {teacherName}!
            </h3>
            <div className="flex gap-2 flex-wrap">
              <p className="text-[14px] text-[#737373] font-[400]">
                {formatTodayLabel()}
                {classLabel ? " ." : ""}
              </p>
              {classLabel && (
                <p className="text-[14px] text-[#16A34A] font-[400]">
                  You are the class teacher of {classLabel}
                </p>
              )}
            </div>
          </div>
          <div className="text-sm text-slate-500">&nbsp;</div>
        </div>
      </section>

      <div className="flex w-full grid-cols-1 md:grid-cols-4 gap-[20px] mb-[20px] grid">
        <StatCard
          label="Total Students"
          progressLabel="+180 Last Month"
          value={totalStudents}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={Users}
          iconBgColor="bg-[#D3FFF1]"
        />
        <StatCard
          label="Attendance"
          value={attendanceDone ? "Completed" : "Pending"}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={ClipboardCheck}
          progressLabel="+180 Last Month"
          iconBgColor="bg-[#F9EAD0]"
        />
        <StatCard
          label="Pending Marks"
          value="02"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={MailQuestionMark}
          progressLabel="+180 Last Month"
          iconBgColor="bg-[#CCDEFF]"
        />
        <StatCard
          label="Next Class"
          value={getNextClass(todaySchedule)}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={Users}
          progressLabel="+180 Last Month"
          iconBgColor="bg-[#E4D8FF]"
        />
      </div>

      <div className="flex flex-row gap-4">
        <section className="w-2/3 gap-4 mb-4 flex flex-col">
          {hasClass ? (
            <div className="bg-[#FFFFFF] rounded-[8px] border border-[#D7E3FC]">
              <div className="flex items-start justify-between px-6 py-6">
                <div>
                  <div className="text-[24px] text-[#021034] font-semibold">
                    My Class: {classLabel}
                  </div>
                  <div className="mt-1 text-[14px] text-[#737373] font-[400]">
                    Class Teacher Responsibilities
                    {assignedClass?.room ? ` · Room ${assignedClass.room}` : ""}
                  </div>
                </div>

                <div className="flex flex-col text-right text-[14px] text-[#737373] font-[400]">
                  <span className="mt-1 text-[24px] text-[#021034] font-semibold">
                    {totalStudents}
                  </span>
                  Total Students
                </div>
              </div>

              <div className="rounded-b-md border-t-2 border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!attendanceDone && (
                    <div className="text-amber-600">{WarningIcon()}</div>
                  )}
                  <div className="text-[14px] text-[#737373] font-[600]">
                    {attendanceDone
                      ? "Today's attendance has been submitted."
                      : "Today's attendance not yet submitted."}
                  </div>
                </div>
                {!attendanceDone && (
                  <button
                    onClick={() => router.push("/teacher/attendance")}
                    className="inline-flex items-center gap-2 bg-[#021034] text-white px-4 py-2 rounded-md shadow-sm cursor-pointer hover:bg-[#021034]/90 transition"
                  >
                    <span>+ Take Attendance</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <h3 className="text-lg font-medium">No class assigned</h3>
              <p className="text-sm text-slate-600">
                You are not a class teacher of any class.
              </p>
            </Card>
          )}

          <AssignedSubjectsCard
            subjects={mapSubjects(assignedSubjects)}
            onViewStudents={(item) => console.log("View", item)}
            onEnterMarks={(item) => console.log("Enter marks", item)}
            onExport={() => console.log("Export report")}
          />
        </section>

        <TodayScheduleCard
          dayLabel={getDayLabel()}
          schedules={mapSchedule(todaySchedule)}
          onViewWeek={() => console.log("View full week")}
        />
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
