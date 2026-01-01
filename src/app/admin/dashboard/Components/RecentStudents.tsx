"use client";
import React from "react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Image from "next/image";

type Student = {
  id: string;
  name: string;
  createdAt: string;
  email?: string | null;
  photoUrl?: string | null;
};

type Props = {
  students: Student[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;

    const now = Date.now();
    const diffSeconds = Math.round((date.getTime() - now) / 1000); // negative = past
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    const absSeconds = Math.abs(diffSeconds);
    if (absSeconds < 60) return rtf.format(diffSeconds, "second");

    const diffMinutes = Math.round(diffSeconds / 60);
    if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");

    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");

    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");

    const diffYears = Math.round(diffMonths / 12);
    return rtf.format(diffYears, "year");
  } catch {
    return iso;
  }
}

export default function RecentStudents({
  students,
  loading,
  error,
  onRetry,
}: Props) {
  if (loading) {
    return (
      <Card>
        <div className="space-y-3">
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-start gap-4">
          <div className="text-sm text-slate-700">
            Something went wrong: {error}
          </div>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </Card>
    );
  }

  if (!students || students.length === 0) {
    return (
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">
            No recent students
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            New students will appear here when they register.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-4">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-[24px] text-[#021034] font-[600] text-slate-900">
            Recent Activities{" "}
          </h2>
          <p className="text-[14px]  text-[#737373] font-[400]">
            Check complete update at same time.
          </p>
        </div>

        <button
          // onClick={onViewAll}
          className="rounded-lg border px-3 py-[5.5px] text-sm text-slate-600 transition hover:bg-slate-50"
        >
          {"View all Activity"}
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y">
        {students.map((student, index) => (
          <div key={index} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 px-2">
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                {/* <span className="text-sm font-medium text-slate-600">NA</span> */}
                <Image
                  src={student?.photoUrl ?? "/images/avatar.png"}
                  alt={student.name}
                  width={72}
                  height={72}
                  unoptimized
                  className="h-9 w-9 rounded-full object-cover"
                />
              </div>

              {/* Text */}
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {student.name.toUpperCase()}
                </p>
                <p className="text-sm text-slate-500">{student.email}</p>
              </div>
            </div>

            {/* Time */}
            <span className="text-sm text-slate-500 pr-2">
              {formatDate(student.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
