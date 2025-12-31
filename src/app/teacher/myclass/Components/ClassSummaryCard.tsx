"use client";

import { AlertCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type ClassSummaryCardProps = {
  className: string;
  section: string;
  location: string;
  academicYear: string;
  totalStudents: number;
  showAlert?: boolean;
  alertText?: string;
};

export default function ClassSummaryCard({
  className,
  section,
  location,
  academicYear,
  totalStudents,
  showAlert = false,
  alertText = "Today's attendance not yet submitted",
}: ClassSummaryCardProps) {
  const router = useRouter();
  return (
    <div className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Top Section */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Class: {className}{"-"}{section}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{location}</p>
          </div>

          <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
            {academicYear}
          </span>
        </div>

        <div className="mt-6 ">
          <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
          <p className="mt-1 text-sm text-slate-500">Total Students</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200" />

      {/* Bottom Section */}
      <div className="flex items-center sticky bottom-0 justify-between p-4">
        {showAlert ? (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{alertText}</span>
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={() => {
            router.push("/teacher/attendance");
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Take Attendance
        </button>
      </div>
    </div>
  );
}
