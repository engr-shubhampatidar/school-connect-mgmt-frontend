"use client";
import React, { useState } from "react";
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
import Image from "next/image";
// import EditStudentDialog from "./EditStudentDialog";

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
    Math.ceil((total || students.length) / pageSize),
  );
  const [open, setOpen] = useState(false);

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
    <div className="rounded-lg bg-white border border-[#D7E3FC] ">
      <div className="overflow-x-auto ">
        <Table className="w-full table-auto">
          <TableHeader className="sticky top-0  ">
            <TableRow>
              <TableHead className="text-left py-4 pl-6 w-48 hidden lg:table-cell">
                Roll No.
              </TableHead>
              <TableHead className="text-left py-4 px-4">Name</TableHead>
              <TableHead className="text-left py-4 hidden lg:table-cell">
                Class & Section
              </TableHead>
              <TableHead className="text-left py-4 hidden lg:table-cell">
                Created
              </TableHead>
              <TableHead className="text-left py-4 hidden lg:table-cell">
                Fees Status
              </TableHead>
              <TableHead className="text-right py-4 pr-10">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((s) => (
              <TableRow
                key={s.id}
                className="border-t border-[#D7E3FC] text-[#021034] text-[14px] font-[500] hover:bg-slate-50"
              >
                <TableCell className="py-3 hidden lg:table-cell p-6">
                  {s.studentId }
                </TableCell>

                <TableCell className="p-3">
                  <div className="font-medium text-slate-900 flex items-center gap-3 cursor-pointer">
                    <div className="w-12 h-12">
                      <Image
                        src={
                          "https://i.pinimg.com/736x/2a/bd/c4/2abdc427589317e312e55100ac612ace.jpg"
                        }
                        alt="Avatar"
                        width={72}
                        height={72}
                        className="rounded-full h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="text-[14px]">{s.name ?? "-"}</div>
                      <div className="text-[12px] text-[#737373]">
                        Id-{s.id.slice(0, 8) ?? "-"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 hidden lg:table-cell">
                  <div className=" flex">
                    <div className="border border-[#D7E3FC] max-w-full px-2 py-1 rounded-full">
                      {typeof s.class === "string"
                        ? s.class
                        : s.class
                          ? `${s.class.name}${
                              s.class.section ? ` - ${s.class.section}` : ""
                            }`
                          : "-"}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 hidden lg:table-cell">
                  {new Intl.DateTimeFormat(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(s.createdAt))}
                </TableCell>
                <TableCell className="py-3 hidden lg:table-cell">
                  <div className=" flex">
                    <div className="border border-[#16A34A] bg-[#DCFCE7] text-[12px] font-[600] max-w-full px-2 py-1 rounded-full">
                      paid
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 flex justify-end pr-6">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => onView?.(s.id)}>
                      View
                    </Button>
                    <Button variant="dark" onClick={() => onEdit?.(s.id)}>
                      Edit Student
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
      </div>

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
    </div>
  );
}
