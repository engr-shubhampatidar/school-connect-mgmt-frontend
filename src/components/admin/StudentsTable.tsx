"use client";
import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../ui/table";
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
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="text-left py-2">Name</TableHead>
              <TableHead className="text-left py-2">Roll No</TableHead>
              <TableHead className="text-left py-2">Class</TableHead>
              <TableHead className="text-left py-2">Created</TableHead>
              <TableHead className="text-left py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={i} className="border-t">
                <TableCell className="py-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead className="text-left py-2">Name</TableHead>
            <TableHead className="text-left py-2">Roll No</TableHead>
            <TableHead className="text-left py-2">Class</TableHead>
            <TableHead className="text-left py-2">Created</TableHead>
            <TableHead className="text-right py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id} className="border-t hover:bg-slate-50">
              <TableCell className="py-3">{s.name}</TableCell>
              <TableCell className="py-3">{s.rollNo ?? "-"}</TableCell>
              <TableCell className="py-3">
                {typeof s.class === "string"
                  ? s.class
                  : s.class
                  ? `${s.class.name}${
                      s.class.section ? ` - ${s.class.section}` : ""
                    }`
                  : "-"}
              </TableCell>
              <TableCell className="py-3">
                {new Intl.DateTimeFormat(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(s.createdAt))}
              </TableCell>
              <TableCell className="py-3 text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => onView?.(s.id)}>
                    View
                  </Button>
                  <Button variant="ghost" onClick={() => onEdit?.(s.id)}>
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableCaption>
          Showing {students.length} of {total ?? students.length}
        </TableCaption>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <div />
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
