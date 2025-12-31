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
      router.push("/teacher/login");
      return;
    }

    let mounted = true;
    async function load() {
      try {
        const me = await getTeacherMe().catch(() => null);
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
          const maybeMessage = (err as { message?: unknown }).message;
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
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-20 rounded-lg bg-slate-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-28 rounded-lg bg-slate-100" />
            <div className="h-28 rounded-lg bg-slate-100" />
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
            <h3 className="text-xl font-semibold">
              Welcomeback, {teacher?.name ?? "Teacher"}!
            </h3>
            <div className="flex gap-4">
              <p className=" text-sm text-slate-600">
                Monday, October 23, 2026
              </p>
              <p className=" text-sm text-green-700 font-medium">
                You are the class teacher of {klass.name}{" "}
                {klass.section ? `- ${klass.section}` : ""}
              </p>
            </div>
          </div>
          <div className="text-sm text-slate-500">&nbsp;</div>
        </div>
      </section>
      <div className="flex w-full grid-cols-1 md:grid-cols-4 gap-4 mb-4 grid">
        <StatCard
          label="Total Students"
          value={students.length}
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={Users}
        />
        <StatCard
          label="Attenadance"
          value="Pandding"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={ClipboardCheck}
        />
        <StatCard
          label="Pandding Marks"
          value="02"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={MailQuestionMark}
        />
        <StatCard
          label="Next Class"
          value="Physics"
          className="bg-[#FFFFFF] border-[#D7E3FC]"
          icon={Users}
        />
      </div>
      <div className="flex flex-row gap-4">
        <section className="w-2/3 gap-4 mb-4 flex flex-col">
          <div className="bg-[#D7E3FC] rounded-lg border border-slate-100">
            <div className="flex items-start justify-between px-6 py-6">
              <div>
                <div className="text-lg font-semibold">
                  My Class: {klass.name}{" "}
                  {klass.section ? `- ${klass.section}` : ""}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Class Teacher Responsibilities
                </div>
              </div>

              <div className="text-sm text-slate-600">
                Total Students:{" "}
                <span className="font-semibold">{students.length ?? "NA"}</span>
              </div>
            </div>

            <div className="  rounded-b-md border-t-2 border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-amber-600">{WarningIcon()}</div>
                <div className="text-sm text-amber-800">
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
