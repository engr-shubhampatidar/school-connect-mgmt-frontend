"use client";
import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Student } from "../../lib/adminApi";

type Props = {
  students: Student[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export default function StudentsTable({
  students,
  loading,
  error,
  total = 0,
  page = 1,
  pageSize = 10,
  onRetry,
  onPageChange,
  onView,
  onEdit,
}: Props) {
  const totalPages = Math.max(
    1,
    Math.ceil((total || students.length) / pageSize)
  );

  if (loading) {
    return (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Roll No</th>
                <th className="text-left py-2">Class</th>
                <th className="text-left py-2">Created</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="py-3">
                    <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-start gap-4">
          <div className="text-sm text-slate-700">Error: {error}</div>
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
            No students found
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Try adjusting filters or add a new student.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Roll No</th>
              <th className="text-left py-2">Class</th>
              <th className="text-left py-2">Created</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="py-3">{s.name}</td>
                <td className="py-3">{s.rollNo ?? "-"}</td>
                <td className="py-3">{s.class ?? "-"}</td>
                <td className="py-3">
                  {new Intl.DateTimeFormat(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(s.createdAt))}
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => onView?.(s.id)}>
                      View
                    </Button>
                    <Button variant="ghost" onClick={() => onEdit?.(s.id)}>
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing {students.length} of {total ?? students.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(Math.max(1, (page || 1) - 1))}
            disabled={(page || 1) <= 1}
          >
            Previous
          </Button>
          <div className="text-sm text-slate-700">
            Page {page} / {totalPages}
          </div>
          <Button
            onClick={() => onPageChange(Math.min(totalPages, (page || 1) + 1))}
            disabled={(page || 1) >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
