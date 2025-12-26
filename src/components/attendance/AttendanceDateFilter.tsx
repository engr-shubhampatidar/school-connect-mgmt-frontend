"use client";
import React from "react";

export default function AttendanceDateFilter({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (isoDate: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-500">Select Date and check History</div>
      <input
        aria-label="Select date"
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm"
      />
    </div>
  );
}
