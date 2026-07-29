"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { Card } from "../../../components/ui/Card";
import AttendanceStatusBar, {
  type AttendanceValue,
} from "../../../components/ui/AttendanceStatusBar";
import { useToast } from "../../../components/ui/use-toast";
import {
  getTeacherClass,
  fetchAttendanceForClassDate,
  markAttendance,
  type TeacherClass,
} from "../../../lib/teacherApi";
import { ensureSessionReady, getAccessToken, getActiveRole } from "../../../lib/auth";
import SuccessModal from "../../../components/ui/SuccessModal";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type StudentRow = {
  studentId: string;
  name: string;
  status?: AttendanceValue;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TeacherAttendancePage() {
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const router = useRouter();
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);
  const [loading, setLoading] = useState(true);
  const [klass, setKlass] = useState<TeacherClass | null>(null);
  const [date, setDate] = useState<string>(todayISO());
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const q = (search ?? "").trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const name = (s.name ?? "").toString().toLowerCase();
      const studentId = (s.studentId ?? "").toString().toLowerCase();
      return name.includes(q) || studentId.includes(q);
    });
  }, [students, search]);
  const [submitting, setSubmitting] = useState(false);
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [open, setOpen] = useState(false);
  const notAssign: any = "N/A";

  useEffect(() => {
    let mounted = true;
    async function load() {
      await ensureSessionReady();
      if (!mounted) return;
      if (!getAccessToken() || getActiveRole() !== "teacher") {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const { class: classData, students: classStudents } =
          await getTeacherClass();
        if (!mounted) return;

        setKlass(classData);
        setStudents(
          (classStudents ?? []).map((s) => ({
            studentId: s.studentId,
            name: s.name ?? "",
            status: undefined,
          })),
        );
      } catch (err: unknown) {
        let message = "Error";
        if (typeof err === "object" && err !== null && "message" in err) {
          message = (err as { message?: string }).message ?? message;
        }
        toastRef.current?.({
          title: "Unable to load class",
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

  useEffect(() => {
    if (!klass?.id) return;
    const classId = klass.id;
    let mounted = true;
    async function loadAttendance() {
      try {
        const data = (await fetchAttendanceForClassDate(classId, date)) as
          | { students?: unknown[] }
          | undefined;
        if (!mounted) return;
        if (data && Array.isArray(data.students) && data.students.length > 0) {
          const map = (data.students as unknown[]).reduce(
            (acc: Record<string, string>, cur: unknown) => {
              const id =
                (cur as { studentId?: string; id?: string }).studentId ??
                (cur as { studentId?: string; id?: string }).id;
              const status = (cur as { status?: string }).status ?? "";
              if (id) acc[id] = status;
              return acc;
            },
            {} as Record<string, string>,
          );
          setStudents((s) =>
            s.map((r) => ({
              ...r,
              status: map[r.studentId]
                ? (map[r.studentId] as AttendanceValue)
                : undefined,
            })),
          );
          setAttendanceExists(true);
        } else {
          setAttendanceExists(false);
        }
      } catch {
        // silently ignore - may be not found
        setAttendanceExists(false);
      }
    }
    loadAttendance();
    return () => {
      mounted = false;
    };
  }, [klass, date]);

  if (loading) {
    const rows = Array.from({ length: 8 }).map((_, i) => (
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
            <div className="h-8 w-40 rounded-full bg-slate-200" />
          </div>
        </td>
      </tr>
    ));

    return (
      <div className="space-y-2 p-4 pb-20 animate-pulse" aria-hidden>
        {/* Class header card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-7 w-48 rounded bg-slate-300" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-8 w-36 rounded-md bg-slate-300" />
            </div>
          </div>
        </div>

        {/* Student list card */}
        <div className="w-full rounded-xl border bg-white shadow-sm">
          <div className="flex items-start justify-between p-6">
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-slate-300" />
              <div className="h-4 w-48 rounded bg-slate-200" />
            </div>
            <div className="h-9 w-56 rounded-lg bg-slate-200" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">
                    <div className="h-3 w-16 rounded bg-slate-200" />
                  </th>
                  <th className="px-6 py-3 font-medium">
                    <div className="h-3 w-28 rounded bg-slate-200" />
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    <div className="ml-auto h-3 w-32 rounded bg-slate-200" />
                  </th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="border-t bg-white fixed bottom-0 left-0 w-full md:pl-64 lg:pl-72">
          <div className="mx-auto flex max-h-20 items-center justify-between px-6 py-4">
            <div className="h-4 w-64 rounded bg-slate-200" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 rounded bg-slate-200" />
              <div className="h-9 w-36 rounded-lg bg-slate-300" />
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
            Attendance is only available for class teachers.
          </p>
        </Card>
      </div>
    );
  }

  const maxDate = todayISO();

  const setStatus = (studentId: string, status: StudentRow["status"]) => {
    setStudents((s) =>
      s.map((r) => (r.studentId === studentId ? { ...r, status } : r)),
    );
  };

  const save = async () => {
    if (new Date(date) > new Date()) {
      toast({
        title: "Invalid date",
        description: "Cannot mark attendance for future dates",
        type: "error",
      });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        classId: klass.id,
        date,
        students: students.map((s) => ({
          studentId: s.studentId,
          // backend now accepts PRESENT, ABSENT and LATE — send value as-is
          status: s.status ?? "ABSENT",
        })),
      };
      await markAttendance(payload);
      toast({
        title: "Saved",
        description: "Attendance saved successfully",
        type: "success",
      });
      setAttendanceExists(true);
    } catch (err: unknown) {
      let message = "Unable to save";
      if (typeof err === "object" && err !== null && "message" in err) {
        message = (err as { message?: string }).message ?? message;
      }
      toast({
        title: "Save failed",
        description: message,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-2 p-4 pb-20">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
            <div>
              <p className="text-[12px] text-slate-600">Class & Section</p>
              <h2 className="text-[24px] font-[600]">
                {klass.name}
                {klass.section ? ` -Section ${klass.section}` : ""}
              </h2>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex w-full items-center justify-end">
                <p className="text-[10px] text-right  text-slate-400">
                  {"Today's Attendance"}
                </p>
              </div>
              <input
                type="date"
                value={date}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm"
              />
            </div>
          </div>
        </Card>
        <div className="overflow-y-auto max-h-[400px]"></div>

        <Card className="w-full rounded-xl border bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Student List
              </h2>
              <p className="text-sm text-slate-500">
                Mark attendance for {filteredStudents.length} students
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or student id"
                aria-label="Search students by name or student id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className=" text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Student Id</th>
                  <th className="px-6 py-3 font-medium">Student Name</th>
                  <th className="px-6 py-3 font-medium text-right">
                    Attendance Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s, index) => (
                  <tr
                    key={s.studentId}
                    className={`border-b last:border-none ${
                      index % 2 === 0 ? "bg-slate-50" : ""
                    }`}
                  >
                    {/* Student Id */}
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {s.studentId || "-"}
                    </td>

                    {/* Student */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          router.push(`/teacher/attendance/${s.studentId}`)
                        }
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                          {s.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">
                          {s.name}
                        </span>
                      </button>
                    </td>

                    {/* Attendance */}
                    <td className="px-6 py-4 ">
                      <div className="flex justify-end   ">
                        <AttendanceStatusBar
                          value={s.status || notAssign}
                          onChange={(v) => setStatus(s.studentId, v)}
                          disabled={attendanceExists}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className=" border-t bg-white fixed bottom-0 left-0 w-full  md:pl-64 lg:pl-72">
        <div className="mx-auto sticky  bottom-0 flex max-h-20 items-center justify-between px-6 py-4">
          {/* Left Info */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <span>Attendance can be edited by today only</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
              Cancel
            </button>

            <button
              // onClick={() => setOpen(true)}
              onClick={() => {
                setOpen(true);
                save();
              }}
              disabled={submitting || attendanceExists}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer"
            >
              {submitting
                ? "Saving…"
                : attendanceExists
                  ? "Already marked"
                  : "Save Attendance"}
            </button>
          </div>
        </div>
        <SuccessModal open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
