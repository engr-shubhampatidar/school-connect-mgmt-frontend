"use client";
import React from "react";
import AttendanceStatusBar, {
  type AttendanceValue,
} from "../../../../components/ui/AttendanceStatusBar";
import { useRouter } from "next/navigation";

type Row = {
  studentId: string;
  name?: string;
  rollNo?: string | number | null;
  status?: AttendanceValue;
};

export default function StudentAttendanceList({
  items,
  onChange,
  disabled,
}: {
  items: Row[];
  onChange?: (studentId: string, status: AttendanceValue) => void;
  disabled?: boolean;
}) {
  const router = useRouter();

  return (
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
          {items.map((s, index) => (
            <tr
              key={s.studentId}
              className={`border-b last:border-none ${
                index % 2 === 0 ? "bg-slate-50" : ""
              }`}
            >
              <td className="px-6 py-4 font-medium text-slate-700">
                {s.rollNo ?? "-"}
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
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <AttendanceStatusBar
                    value={(s.status as AttendanceValue) ?? "PRESENT"}
                    onChange={(v) => onChange && onChange(s.studentId, v)}
                    disabled={Boolean(disabled)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
