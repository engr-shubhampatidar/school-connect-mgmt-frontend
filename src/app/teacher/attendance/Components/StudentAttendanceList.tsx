import { Search, Check, X, Clock } from "lucide-react";

export type AttendanceStatus = "present" | "absent" | "leave";

type Student = {
  rollNo: string;
  name: string;
  avatarUrl?: string;
  status?: AttendanceStatus;
};

type StudentAttendanceListProps = {
  title?: string;
  subtitle?: string;
  students: Student[];
  onStatusChange?: (rollNo: string, status: AttendanceStatus) => void;
};

export default function StudentAttendanceList({
  title = "Student List",
  subtitle = "Mark attendance for students",
  students,
  onStatusChange,
}: StudentAttendanceListProps) {
  return (
    <div className="w-full rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            {subtitle} ({students.length})
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search Students..."
            className="rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Roll No.</th>
              <th className="px-6 py-3 font-medium">Student Name</th>
              <th className="px-6 py-3 font-medium text-right">
                Attendance Status
              </th>
            </tr>
          </thead>

          <tbody>
              {students.map((student, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-none ${
                    index === 4 ? "bg-slate-50" : ""
                  }`}
                >
                  {/* Roll No */}
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {student.rollNo}
                  </td>

                  {/* Student */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                        DP
                      </div>
                      <span className="font-medium text-slate-900">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <AttendanceButton
                        icon={<Check size={14} />}
                        label="Present"
                        active={student.status === "present"}
                        onClick={() =>
                          onStatusChange?.(student.rollNo, "present")
                        }
                      />
                      <AttendanceButton
                        icon={<X size={14} />}
                        label="Absent"
                        active={student.status === "absent"}
                        onClick={() =>
                          onStatusChange?.(student.rollNo, "absent")
                        }
                      />
                      <AttendanceButton
                        icon={<Clock size={14} />}
                        label="Leave"
                        active={student.status === "leave"}
                        onClick={() =>
                          onStatusChange?.(student.rollNo, "leave")
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Small Reusable Button ---------------- */

function AttendanceButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition
        ${
          active
            ? "border-blue-300 bg-blue-50 text-blue-600"
            : "border-slate-200 text-slate-500 hover:bg-slate-50"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
