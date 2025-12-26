"use client";
import React from "react";
import AttendanceStatusBadge from "./AttendanceStatusBadge";

function formatDateISO(iso?: string) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function weekday(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  } catch {
    return "";
  }
}

function smallDot(color: string) {
  return `w-2 h-2 rounded-full ${color}`;
}

export default function AttendanceRow({ record }: { record: any }) {
  const present = (record.students ?? []).filter(
    (s: any) => (s.status ?? "") === "PRESENT"
  ).length;
  const absent = (record.students ?? []).filter(
    (s: any) => (s.status ?? "") === "ABSENT"
  ).length;
  const leave = (record.students ?? []).filter(
    (s: any) => (s.status ?? "") === "LEAVE"
  ).length;
  const isComplete =
    (record.status ?? "") === "MARKED" ||
    (record.status ?? "").toLowerCase() === "complete";

  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="py-4">
        <div className="text-sm font-semibold">
          {formatDateISO(record.date)}
        </div>
        <div className="text-xs text-slate-400">{weekday(record.date)}</div>
      </td>
      <td className="py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={smallDot("bg-emerald-500")} />
          <span className="font-semibold">{present}</span>
        </div>
      </td>
      <td className="py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={smallDot("bg-rose-500")} />
          <span className="font-semibold">{absent}</span>
        </div>
      </td>
      <td className="py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={smallDot("bg-orange-400")} />
          <span className="font-semibold">{leave}</span>
        </div>
      </td>
      <td className="py-4 text-center">
        <AttendanceStatusBadge complete={isComplete} />
      </td>
      <td className="py-4 text-right">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-slate-400 ml-auto inline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </td>
    </tr>
  );
}
