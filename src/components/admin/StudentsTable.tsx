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
} from "../ui/table";
import { Student } from "../../lib/adminApi";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
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
  pageSize = 20,
  onRetry,
  onPageChange,
  onView,
  onEdit,
}: Props) {
  const totalPages = Math.max(
    1,
    Math.ceil((total || students.length) / pageSize),
  );
<<<<<<< HEAD

  const getPageNumbers = () => {
    const currentPage = page || 1;
=======
  const getPageNumbers = () => {
>>>>>>> 5ebc1b386be79c532800c85e9d07137a75183e4c
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

<<<<<<< HEAD
      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
=======
      if (page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
>>>>>>> 5ebc1b386be79c532800c85e9d07137a75183e4c

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

<<<<<<< HEAD
      if (currentPage < totalPages - 2) {
=======
      if (page < totalPages - 2) {
>>>>>>> 5ebc1b386be79c532800c85e9d07137a75183e4c
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };
<<<<<<< HEAD
  // const [open, setOpen] = useState(false);
=======
  const [open, setOpen] = useState(false);
>>>>>>> 5ebc1b386be79c532800c85e9d07137a75183e4c

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
        <div className="flex w-full justify-between p-4 items-center">
          <div>
            Showing {students.length} of {total ?? students.length}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, (page || 1) - 1))}
                    disabled={(page || 1) <= 1}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, idx) => (
                  <PaginationItem key={idx}>
                    {pageNumber === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={pageNumber === page}
                        onClick={() => onPageChange(pageNumber)}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, (page || 1) + 1))
                    }
                    disabled={(page || 1) >= totalPages}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
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
                  {s.studentId}
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
                      {s.className
                        ? `${s.className}${s.section ? ` - ${s.section}` : ""}`
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
<<<<<<< HEAD

          <TableCaption className="border-t border-[#D7E3FC]">
            <div className="flex w-full justify-between p-4 items-center">
              <div>
                Showing {students.length} of {total ?? students.length}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          onPageChange(Math.max(1, (page || 1) - 1))
                        }
                        disabled={(page || 1) <= 1}
                        className="cursor-pointer"
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNumber, idx) => (
                      <PaginationItem key={idx}>
                        {pageNumber === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={pageNumber === page}
                            onClick={() => onPageChange(pageNumber)}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          onPageChange(Math.min(totalPages, (page || 1) + 1))
                        }
                        disabled={(page || 1) >= totalPages}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </TableCaption>
        </Table>
      </div>
=======
        </Table>
      </div>

      <div className="border-t border-[#D7E3FC] mt-4" />

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-4">
        <div className="text-sm text-slate-600">
          Showing {students.length} of {total ?? students.length}
        </div>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, (page || 1) - 1))}
                disabled={(page || 1) <= 1}
                className="cursor-pointer"
              />
            </PaginationItem>

            {getPageNumbers().map((pageNumber, idx) => (
              <PaginationItem key={idx}>
                {pageNumber === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={() => onPageChange(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, (page || 1) + 1))
                }
                disabled={(page || 1) >= totalPages}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
>>>>>>> 5ebc1b386be79c532800c85e9d07137a75183e4c
    </div>
  );
}
