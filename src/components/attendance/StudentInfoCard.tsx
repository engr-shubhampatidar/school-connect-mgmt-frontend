"use client";
import React from "react";
import { Card } from "../ui/Card";

export default function StudentInfoCard({
  student,
}: {
  student: {
    id?: string;
    name?: string | null;
    rollNo?: string | number | null;
    className?: string | null;
    subject?: string | null;
  } | null;
}) {
  const name = student?.name ?? "Student Name";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold">
          {initials}
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-900">{name}</div>
          <div className="text-sm text-slate-500">ID: {student?.id ?? "-"}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm text-slate-500">Roll No</div>
        <div className="font-medium text-slate-900">
          {student?.rollNo ?? "-"}
        </div>
        <div className="mt-2 inline-flex items-center gap-2">
          <div className="text-sm text-slate-500">Class</div>
          <div className="text-sm font-medium bg-slate-100 rounded px-2 py-0.5">
            {student?.className ?? "-"}
          </div>
          {student?.subject && (
            <div className="ml-2 text-xs bg-amber-100 text-amber-800 rounded px-2 py-0.5">
              {student.subject}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
