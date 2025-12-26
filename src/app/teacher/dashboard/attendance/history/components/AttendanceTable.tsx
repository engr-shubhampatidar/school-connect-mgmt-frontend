"use client";
import React from "react";
import AttendanceRow from "./AttendanceRow";

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-3">
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </td>
      <td className="py-3">
        <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
      </td>
      <td className="py-3">
        <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
      </td>
      <td className="py-3">
        <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
      </td>
      <td className="py-3">
        <div className="h-4 w-20 bg-slate-200 rounded mx-auto" />
      </td>
      <td className="py-3">
        <div className="h-4 w-4 bg-slate-200 rounded ml-auto" />
      </td>
    </tr>
  );
}

export default function AttendanceTable({
  loading,
  error,
  records,
}: {
  loading: boolean;
  error: string | null;
  records: any[];
}) {
  if (loading) {
    return (
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left text-sm text-slate-500 pb-2">Date</th>
            <th className="text-center text-sm text-slate-500 pb-2">Present</th>
            <th className="text-center text-sm text-slate-500 pb-2">Absent</th>
            <th className="text-center text-sm text-slate-500 pb-2">Leave</th>
            <th className="text-center text-sm text-slate-500 pb-2">Status</th>
            <th className="text-right text-sm text-slate-500 pb-2">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    );
  }

  if (error) {
    return <div className="text-sm text-rose-600">{error}</div>;
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-sm text-slate-600">No attendance records found</div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left text-sm text-slate-500 pb-2">Date</th>
          <th className="text-center text-sm text-slate-500 pb-2">Present</th>
          <th className="text-center text-sm text-slate-500 pb-2">Absent</th>
          <th className="text-center text-sm text-slate-500 pb-2">Leave</th>
          <th className="text-center text-sm text-slate-500 pb-2">Status</th>
          <th className="text-right text-sm text-slate-500 pb-2">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <AttendanceRow key={r.date} record={r} />
        ))}
      </tbody>
    </table>
  );
}
