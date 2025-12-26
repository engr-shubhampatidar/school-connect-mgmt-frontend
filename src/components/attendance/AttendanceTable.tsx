"use client";
import React from "react";
import AttendanceRow from "./AttendanceRow";

export default function AttendanceTable({ records }: { records: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-3">Date</th>
            <th className="py-3">Day</th>
            <th className="py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-6 text-center text-slate-500">
                No attendance records for selected date
              </td>
            </tr>
          ) : (
            records.map((r, idx) => <AttendanceRow key={idx} record={r} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
