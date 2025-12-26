"use client";
import React from "react";
import { Check, X, Clock } from "lucide-react";

export default function AttendanceStatusBadge({
  status,
}: {
  status?: string | null;
}) {
  const s = (status ?? "").toLowerCase();
  if (s === "present" || s === "p") {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 text-emerald-700 px-3 py-1 text-sm">
        <Check size={14} /> Present
      </div>
    );
  }
  if (s === "absent" || s === "a") {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-red-200 text-red-700 px-3 py-1 text-sm">
        <X size={14} /> Absent
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-amber-200 text-amber-800 px-3 py-1 text-sm">
      <Clock size={14} /> Leave
    </div>
  );
}
