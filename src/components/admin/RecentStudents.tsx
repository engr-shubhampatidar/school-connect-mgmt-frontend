"use client";
import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Image from "next/image";

type Student = {
  id: string;
  name: string;
  createdAt: string;
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
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
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
    <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Students
          </h2>
          <p className="text-sm text-slate-500">
            Check complete update at same time.
          </p>
        </div>

        {/* <button
          onClick={onViewAll}
          className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
        >
          {viewAllText}
        </button> */}
      </div>

      {/* Activity List */}
      <div className="divide-y">
        {students.map((student, index) => (
          <div key={index} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                <span className="text-sm font-medium text-slate-600">NA</span>
              </div>

              {/* Text */}
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {student.name}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(student.createdAt)}
                </p>
              </div>
            </div>

            {/* Time */}
            <span className="text-sm text-slate-500">
              {formatDate(student.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
