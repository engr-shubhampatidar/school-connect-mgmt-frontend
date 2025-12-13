"use client";
import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

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
    <Card>
      <div>
        <h3 className="text-lg font-medium text-slate-900">Recent Students</h3>
        <div className="mt-4 divide-y divide-slate-100">
          {students.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div className="text-sm text-slate-800">{s.name}</div>
              <div className="text-sm text-slate-500">
                {formatDate(s.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
