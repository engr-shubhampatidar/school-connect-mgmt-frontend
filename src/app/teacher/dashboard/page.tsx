"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../components/ui/Card";
import { useToast } from "../../../components/ui/use-toast";
import {
  getTeacherMe,
  getTeacherClass,
  type TeacherClass,
  type TeacherMe,
} from "../../../lib/teacherApi";
import { getToken } from "../../../lib/auth";
import StatCard from "@/components/admin/StatCard";
import { Users, ClipboardCheck, MailQuestionMark } from "lucide-react";
import AssignedSubjectsCard from "../dashboard/Components/AssignedSubjectsCard";
import TodayScheduleCard from "../dashboard/Components/TodayScheduleCard";
import { usePathname } from "next/navigation";
import { get } from "http";

type ApiResponse = {
  class?: TeacherClass;
  students?: Array<{
    id: string;
    name?: string;
    rollNo?: string;
    photoUrl?: string;
  }>;
};

type Student = {
  id?: string;
  name?: string;
  rollNo?: string;
  photoUrl?: string;
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<TeacherMe | null>(null);
  const [klass, setKlass] = useState<TeacherClass | null>(null);
  const [students, setStudents] = useState<
    NonNullable<ApiResponse["students"]>
  >([]);

  const toastRef = React.useRef(toast);
  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    if (!getToken("teacher")) {
      // router.push("/login");
      return;
    }

    let mounted = true;
    async function load() {
      try {
        const me = await getTeacherMe().catch(() => null);
        const subjects = await fetch("");
        if (!mounted) return;
        if (me) setTeacher(me);

        // getTeacherClass may return either { class, students } or raw class
        const raw = (await getTeacherClass()) as unknown;
        if (!mounted) return;

        if (raw && typeof raw === "object") {
          const r = raw as Record<string, unknown>;
          if ("class" in r) {
            const parsed = r as ApiResponse;
            setKlass((parsed.class ?? null) as TeacherClass | null);
            setStudents(parsed.students ?? []);
          } else {
            // legacy: response itself is a class and may have students
            const parsed = raw as TeacherClass & {
              students?: ApiResponse["students"];
            };
            setKlass(parsed as TeacherClass);
            setStudents(parsed.students ?? []);
          }
        }
      } catch (err: unknown) {
        let message = "Error";
        if (typeof err === "object" && err !== null && "message" in err) {
          // const maybeMessage = (err as { message?: unknown }).message;
          const maybeMessage = (err as unknown as { message?: unknown })
            .message;
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
        {/* Top header / class card */}
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
          {/* Left column: main cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Class overview card */}
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

            {/* Student list card skeleton */}
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

          {/* Right column: sidebar cards */}
          <div className="space-y-4">
            {/* Stats / small cards */}
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

            {/* Today's schedule skeleton */}
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

        {/* Bottom fixed action bar */}
        <div className="border-t bg-white fixed bottom-0 left-0 w-full md:pl-64 lg:pl-72">
          <div className="mx-auto flex max-h-20 items-center justify-between px-6 py-4">
            <div className="h-4 w-64 rounded bg-slate-200" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-20 rounded bg-slate-200" />
              <div className="h-9 w-36 rounded bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!klass || !klass.id) {
    return (
      <div className="p-4">
        <Card>
          <h3 className="text-lg font-medium">No class assigned</h3>
          <p className="text-sm text-slate-600">
            You are not a class teacher of any class.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <section className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] text-[#021034] font-[600]">
              Welcomeback, {teacher?.name ?? "Teacher"}!
            </h3>
            <div className="flex gap-2">
              <p className=" text-[14px] text-[#737373] font-[400]">
                Monday, October 23, 2026 .
              </p>
              <p className=" text-[14px] text-[#16A34A] font-[400]">
                You are the class teacher of {klass.name}{" "}
                {klass.section ? `- ${klass.section}` : ""}
              </p>
            </div>
          </div>
          <div className="text-sm text-slate-500">&nbsp;</div>
        </div>
      </section>
      <div className="flex w-full grid-cols-1 md:grid-cols-4 gap-[20px] mb-[20px] grid">
        <StatCard
          label="Total Students"
          progressLabel="+180 Last Month"
          value={students.length}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={Users}
          iconBgColor="bg-[#D3FFF1]"
        />
        <StatCard
          label="Attenadance"
          value="Pandding"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={ClipboardCheck}
          progressLabel="+180 Last Month"
          iconBgColor="bg-[#F9EAD0]"
        />
        <StatCard
          label="Pandding Marks"
          value="02"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={MailQuestionMark}
          progressLabel="+180 Last Month"
          iconBgColor="bg-[#CCDEFF]"
        />
        <StatCard
          label="Next Class"
          value="Physics"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={Users}
          progressLabel="+180 Last Month"
          iconBgColor="bg-[#E4D8FF]"
        />
      </div>
      <div className="flex flex-row gap-4">
        <section className="w-2/3 gap-4 mb-4 flex flex-col">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#D7E3FC]">
            <div className="flex items-start justify-between px-6 py-6">
              <div>
                <div className="text-[24px] text-[#021034] font-semibold">
                  My Class: {klass.name}{" "}
                  {klass.section ? `- ${klass.section}` : ""}
                </div>
                <div className="mt-1 text-[14px] text-[#737373] font-[400]">
                  Class Teacher Responsibilities
                </div>
              </div>

              <div className="flex flex-col text-right  text-[14px] text-[#737373] font-[400]">
                <span className="mt-1 text-[24px] text-[#021034] font-semibold">
                  {students.length ?? "NA"}
                </span>
                Total Students
              </div>
            </div>

            <div className="  rounded-b-md border-t-2 border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-amber-600">{WarningIcon()}</div>
                <div className="text-[14px] text-[#737373] font-[600]">
                  {" Today's attendance not yet submitted."}
                </div>
              </div>
              <button
                onClick={() => router.push("/teacher/attendance")}
                className="inline-flex items-center gap-2 bg-[#021034] text-white px-4 py-2 rounded-md shadow-sm cursor-pointer hover:bg-[#021034]/90 transition"
              >
                {/* <span className="w-4 h-4">{PlusIcon()}</span> */}
                <span>+ Take Attendance</span>
              </button>
            </div>
          </div>
          <AssignedSubjectsCard
            subjects={[
              {
                classSection: "10-A",
                subjectName: "Mathematics",
                studentCount: 32,
              },
              {
                classSection: "10-A",
                subjectName: "Mathematics",
                studentCount: 28,
              },
              {
                classSection: "10-A",
                subjectName: "Science",
                studentCount: 35,
              },
              {
                classSection: "10-A",
                subjectName: "Physics",
                studentCount: 30,
              },
              {
                classSection: "10-A",
                subjectName: "Physics",
                studentCount: 30,
              },
            ]}
            onViewStudents={(item) => console.log("View", item)}
            onEnterMarks={(item) => console.log("Enter marks", item)}
            onExport={() => console.log("Export report")}
          />
        </section>
        <TodayScheduleCard
          schedules={[
            {
              time: "10:00 pm",
              title: "Physics (lab)",
              subtitle: "Class 11-A Lab1",
              status: "completed",
            },
            {
              time: "10:35 pm",
              title: "Physics",
              subtitle: "Class 11-A Room-102",
              status: "current",
            },
            {
              time: "10:35 pm",
              title: "Lunch Break",
              subtitle: "Staff Room-100",
            },
            {
              time: "11:10 pm",
              title: "Mathematics",
              subtitle: "Class 10-B Room-103",
            },
            {
              time: "11:40 pm",
              title: "Mathematics",
              subtitle: "Class 10-A Room-104",
            },
            {
              time: "12:20 pm",
              title: "Science",
              subtitle: "Class 10-C Room-115",
            },
          ]}
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
