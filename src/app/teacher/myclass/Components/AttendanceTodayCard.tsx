"use client";

import { Download, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

type AttendanceTodayCardProps = {
  present: number;
  absent: number;
  leave: number;
  total: number;
  onDownload?: () => void;
  onViewHistory?: () => void;
};

export default function AttendanceTodayCard({
  present,
  absent,
  leave,
  total,
  onDownload,
}: AttendanceTodayCardProps) {
  const router = useRouter();
  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-6 ">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Attendance Today
        </h2>
        <p className="mt-1 text-sm text-slate-500">Today’s Update</p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-6">
        <StatItem label="Present" value={present} color="bg-green-500" />
        <StatItem label="Absent" value={absent} color="bg-red-500" />
        <StatItem label="Leave" value={leave} color="bg-yellow-500" />
        <StatItem label="Total" value={total} color="bg-pink-500" />
      </div>

      {/* Divider */}
      <div className="mt-6 h-px bg-slate-200" />

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Download Monthly Report
        </button>

        <button
          onClick={() => {
            router.push("/teacher/attendance-history");
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <Clock className="h-4 w-4" />
          View Attendance History
        </button>
      </div>
    </div>
  );
}

/* Small reusable stat item */
function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </div>
    </div>
  );
}
