"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";
import {
  getTeacherMe,
  getTeacherClass,
  type TeacherClass,
  type TeacherMe,
} from "../../../lib/teacherApi";
import { getToken } from "../../../lib/auth";

type ApiResponse = {
  class?: TeacherClass;
  students?: Array<{
    id: string;
    name?: string;
    rollNo?: string;
    photoUrl?: string;
  }>;
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<TeacherMe | null>(null);
  const [klass, setKlass] = useState<TeacherClass | null>(null);
  const [students, setStudents] = useState<ApiResponse["students"]>([]);

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
          // @ts-expect-error -- err may have `message` string property
          message = (err as { message?: string }).message ?? message;
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

  const FALLBACK_IMG =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='%2373747a'>?</text></svg>";

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
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">
              {klass.name} {klass.section ? `- ${klass.section}` : ""}
            </h2>
            {teacher?.name && (
              <p className="text-sm text-slate-600">Welcome, {teacher.name}</p>
            )}
            <p className="text-sm text-slate-600">{students.length} students</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/teacher/attendance")}
              variant="default"
              aria-label="Take attendance"
            >
              Take Attendance
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-3">Students</h3>

        {students.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-600">
            No students in this class yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => router.push(`/teacher/students/${s.id}`)}
                className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm text-left bg-white"
                aria-label={`Open ${s.name ?? "student"} profile`}
                type="button"
              >
                {/* <Image
                  src={s.photoUrl ?? FALLBACK_IMG}
                  alt={s.name ? `${s.name} photo` : "Student photo"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                /> */}
                <div>
                  <div className="text-sm font-medium">
                    {s.name ?? "Unnamed"}
                  </div>
                  <div className="text-xs text-slate-500">
                    Roll: {s.rollNo ?? "-"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
