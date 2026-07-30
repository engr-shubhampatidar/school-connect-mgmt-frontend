"use client";
import React from "react";
import AttendanceStatusBadge from "./AttendanceStatusBadge";
import type { AttendanceRecord } from "@/modules/attendance/types/attendance";

export default function AttendanceRow({
  record,
}: {
  record: AttendanceRecord;
}) {
  const date = record?.date ? new Date(String(record.date)) : null;
  const day = date
    ? date.toLocaleDateString(undefined, { weekday: "short" })
    : "-";
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="py-3 text-sm text-slate-700">
        {date ? date.toLocaleDateString() : "-"}
      </td>
      <td className="py-3 text-sm text-slate-700">{day}</td>
      <td className="py-3 text-right">
        <div className="flex items-center justify-end">
          <AttendanceStatusBadge
            status={record?.status ?? record?.attendance ?? ""}
          />
        </div>
      </td>
    </tr>
  );
}
