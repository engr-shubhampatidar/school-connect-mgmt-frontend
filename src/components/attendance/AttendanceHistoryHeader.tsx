"use client";
import React from "react";

export default function AttendanceHistoryHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold text-slate-900">
          Attendance History
        </div>
        <div className="text-sm text-slate-500">
          Last 7 days attendance summary
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600">
        {children}
      </div>
    </div>
  );
}
