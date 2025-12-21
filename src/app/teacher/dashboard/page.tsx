"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/use-toast";
import {
  getTeacherMe,
  getTeacherClass,
  fetchAttendanceByClass,
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

type Student = {
  id: string;
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
  const [students, setStudents] = useState<Student[]>([]);

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
        if (err instanceof Error) message = err.message;
        else if (typeof err === "object" && err !== null && "message" in err)
          message = String((err as { message?: unknown }).message ?? message);
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
                onClick={() => router.push(`/teacher/attendance/${s.id}`)}
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

      <AttendanceHistoryCard classId={klass.id} students={students} />
    </div>
  );
}

function AttendanceHistoryCard({
  classId,
  students,
}: {
  classId: string;
  students: Student[];
}) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<Array<Record<string, unknown>>>([]);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const data = (await fetchAttendanceByClass(classId)) as unknown;
        if (!mounted) return;

        // Normalize into flat records array with { studentId, date, status }
        let flat: Array<Record<string, unknown>> = [];

        if (Array.isArray(data)) {
          // common shape: array of attendance objects each containing `date` and `students`
          const arr = data as Array<Record<string, unknown>>;
          if (arr.length > 0 && Array.isArray(arr[0].students)) {
            for (const att of arr) {
              const d =
                (att as Record<string, unknown>).date ??
                (att as Record<string, unknown>).createdAt ??
                null;
              const ds = d ? String(d).slice(0, 10) : "";
              for (const st of (att as Record<string, unknown>)
                .students as Array<Record<string, unknown>>) {
                const sid =
                  (st as Record<string, unknown>).studentId ??
                  (st as Record<string, unknown>).student_id ??
                  (st as Record<string, unknown>).student ??
                  (st as Record<string, unknown>).sid;
                const status =
                  (st as Record<string, unknown>).status ??
                  (st as Record<string, unknown>).attendance ??
                  "";
                flat.push({ studentId: sid, status, date: ds });
              }
            }
          } else {
            // assume already flat student-level records
            flat = data as Array<Record<string, unknown>>;
          }
        } else if (data && typeof data === "object") {
          // try common shapes: { records: [...] } or { byDate: { date: [...] } }
          const obj = data as Record<string, unknown>;
          const maybeRecords = (obj as Record<string, unknown>)
            .records as unknown;
          const maybeAttendances = (obj as Record<string, unknown>)
            .attendances as unknown;
          if (Array.isArray(maybeRecords))
            flat = maybeRecords as Array<Record<string, unknown>>;
          else if (Array.isArray(maybeAttendances))
            flat = maybeAttendances as Array<Record<string, unknown>>;
          else if (obj.byDate && typeof obj.byDate === "object") {
            for (const [d, items] of Object.entries(obj.byDate)) {
              if (Array.isArray(items)) {
                for (const it of items) {
                  flat.push({ ...(it as object), date: d });
                }
              }
            }
          } else {
            // fallback: try to collect nested arrays
            for (const v of Object.values(obj)) {
              if (Array.isArray(v)) {
                flat = flat.concat(v as Array<Record<string, unknown>>);
              }
            }
          }
        }

        // Ensure date string format and collect unique dates
        const dateSet = new Set<string>();
        flat = flat.map((r) => {
          const d = r.date || r.attendanceDate || r.createdAt || r.day || null;
          const ds = d ? String(d).slice(0, 10) : "";
          if (ds) dateSet.add(ds);
          return { ...r, date: ds };
        });

        const sortedDates = Array.from(dateSet).sort((a, b) =>
          a < b ? 1 : -1
        );
        // show all dates (no 7-day limit)
        const recent = sortedDates;

        setRecords(flat);
        setDates(recent);
      } catch {
        setRecords([]);
        setDates([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [classId]);

  function statusBadge(status?: string) {
    const s = String(status ?? "").toUpperCase();
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (s === "PRESENT" || s === "P")
      return <span className={`${base} bg-green-100 text-green-800`}>P</span>;
    if (s === "ABSENT" || s === "A")
      return <span className={`${base} bg-red-100 text-red-800`}>A</span>;
    if (s === "LATE" || s === "L")
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>L</span>;
    return <span className={`${base} bg-slate-100 text-slate-700`}>-</span>;
  }

  // build lookup: map studentId -> { date -> status }
  const lookup: Record<string, Record<string, string>> = {};
  for (const r of records) {
    const rawSid =
      (r as Record<string, unknown>).studentId ??
      (r as Record<string, unknown>).student ??
      (r as Record<string, unknown>).student_id ??
      (r as Record<string, unknown>).sid;
    const sid = rawSid ? String(rawSid) : "";
    const d = String((r as Record<string, unknown>).date ?? "");
    const st =
      (r as Record<string, unknown>).status ??
      (r as Record<string, unknown>).attendance ??
      (r as Record<string, unknown>).value ??
      "";
    if (!sid || !d) continue;
    if (!lookup[sid]) lookup[sid] = {} as Record<string, string>;
    lookup[sid][d] = String(st);
  }

  return (
    <Card>
      <h3 className="text-sm font-medium mb-3">Attendance History</h3>

      {loading ? (
        <div className="py-6">
          <div className="animate-pulse h-6 w-3/4 rounded bg-slate-100 mb-3" />
          <div className="overflow-x-auto">
            <div className="h-32 rounded bg-slate-100" />
          </div>
        </div>
      ) : dates.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-600">
          No attendance history yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="text-left text-xs text-slate-600">
                <th className="pb-2 pr-4 sticky left-0 bg-white  border-r  w-44">
                  Student
                </th>
                {dates.map((d) => (
                  <th key={d} className="pb-2 w-28 px-4">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 sticky left-0 bg-white border-r w-44 pr-4 align-top">
                    <div className="text-sm font-medium">
                      {s.name ?? "Unnamed"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Roll: {s.rollNo ?? "-"}
                    </div>
                  </td>
                  {dates.map((d) => (
                    <td key={d} className="py-2 px-4 w-28 border-r align-top">
                      {statusBadge(lookup[s.id]?.[d])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
