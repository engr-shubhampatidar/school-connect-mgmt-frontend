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
import { getToken } from "../../../lib/auth";
import SuccessModal from "../../../components/ui/SuccessModal";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type StudentRow = {
  studentId: string;
  name: string;
  rollNo?: string | number | null;
  status: AttendanceValue;
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
      const roll = (s.rollNo ?? "").toString().toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [students, search]);
  const [submitting, setSubmitting] = useState(false);
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getToken("teacher")) {
      // client side redirect if not authenticated
      if (typeof window !== "undefined")
        window.location.href = "/teacher/login";
      return;
    }
    let mounted = true;
    async function load() {
      try {
        const res = await getTeacherClass();
        if (!mounted) return;
        const r = res as unknown as Record<string, unknown> | null;
        const clsData =
          r && typeof r === "object" && "class" in r
            ? (r.class as unknown)
            : (res as unknown);
        const studentsArr = Array.isArray(
          (r as Record<string, unknown> | null)?.students
        )
          ? ((r as Record<string, unknown>)!.students as unknown[])
          : Array.isArray(
              (clsData as Record<string, unknown> | undefined)?.students
            )
          ? ((clsData as Record<string, unknown>)!.students as unknown[])
          : [];
        setKlass(clsData as TeacherClass);
        const st = (studentsArr ?? []).map((s: unknown) => {
          const so = (s as Record<string, unknown>) ?? {};
          return {
            studentId: (so.id ?? so.studentId ?? "") as string,
            name: (so.name ?? "") as string,
            rollNo: (so.rollNo ?? so.roll_no ?? "") as string,
            status: "PRESENT" as AttendanceValue,
          };
        });
        setStudents(st);
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
            {} as Record<string, string>
          );
          setStudents((s) =>
            s.map((r) => ({
              ...r,
              status: (map[r.studentId] ?? "PRESENT") as AttendanceValue,
            }))
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

  if (loading) return <div className="p-4">Loading…</div>;

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
      s.map((r) => (r.studentId === studentId ? { ...r, status } : r))
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
          // backend currently accepts only PRESENT or ABSENT
          // map LATE -> PRESENT to avoid validation errors
          status: s.status === "LATE" ? "PRESENT" : s.status || "ABSENT",
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
      <div className="space-y-4 p-4 pb-20">
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
                Mark attendance for{" "}{filteredStudents.length}{" "}students
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or roll no"
                aria-label="Search students by name or roll number"
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
                  <th className="px-6 py-3 font-medium">Roll No.</th>
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
                    {/* Roll No */}
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {s.rollNo ?? "-"}
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
                          value={s.status || "PRESENT"}
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
