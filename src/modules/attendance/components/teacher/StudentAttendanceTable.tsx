"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import AttendanceStatusBar, {
  type AttendanceValue,
} from "@/components/ui/AttendanceStatusBar";
import type { AttendanceStudentRow } from "@/modules/attendance/hooks/useTeacherAttendance";

/** Sentinel so no status pill renders as selected while a student is unmarked. */
const UNSET = "N/A" as AttendanceValue;

export default function StudentAttendanceTable({
  students,
  onStatusChange,
  disabled = false,
}: {
  students: AttendanceStudentRow[];
  onStatusChange: (id: string, status: AttendanceValue) => void;
  disabled?: boolean;
}) {
  const router = useRouter();
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

  return (
    <Card className="w-full rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Student List</h2>
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
                <td className="px-6 py-4 font-medium text-slate-700">
                  {s.studentId || "-"}
                </td>

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
                    <span className="font-medium text-slate-900">{s.name}</span>
                  </button>
                </td>

                <td className="px-6 py-4 ">
                  <div className="flex justify-end   ">
                    <AttendanceStatusBar
                      value={s.status || UNSET}
                      onChange={(v) => onStatusChange(s.id, v)}
                      disabled={disabled}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
