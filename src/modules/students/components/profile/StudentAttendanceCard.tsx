"use client";

import { CalendarCheck } from "lucide-react";
import type { StudentMonthlyAttendance } from "@/modules/students/types/admin";
import ProfileSection from "./ProfileSection";

type Props = {
  attendance: StudentMonthlyAttendance | null | undefined;
};

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-lg font-medium text-slate-700">{label}</span>
      </div>
      <span className="rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-slate-700">
        {value} Days
      </span>
    </div>
  );
}

export default function StudentAttendanceCard({ attendance }: Props) {
  const percentage = attendance?.percentage ?? 0;
  const clamped = Math.min(Math.max(percentage, 0), 100);

  return (
    <ProfileSection
      title="Attendance"
      className="p-0"
      action={<CalendarCheck className="text-[#737373]" />}
    >
      <div className="border-t border-blue-200" />
      <div className="space-y-8 p-5">
        <div className="py-5">
          <div className="flex items-end gap-2">
            <h3 className="text-5xl font-bold text-slate-900">{percentage}%</h3>
            <span className="mb-1 text-sm font-medium text-green-600">
              This Month Attendance
            </span>
          </div>
          <div className="mt-6 h-5 w-full overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-[#09153E] transition-all"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <StatRow
            label="Present"
            value={attendance?.present ?? 0}
            color="bg-green-500"
          />
          <StatRow
            label="Absent"
            value={attendance?.absent ?? 0}
            color="bg-red-500"
          />
          <StatRow
            label="Leave"
            value={attendance?.leave ?? 0}
            color="bg-amber-500"
          />
        </div>
      </div>
    </ProfileSection>
  );
}
