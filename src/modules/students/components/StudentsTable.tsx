"use client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Student } from "@/modules/students/types/admin";
import Image from "next/image";
import { StudentsTableSkeleton } from "./skeletons/StudentsPageSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  formatClassSection,
  formatDisplayDate,
} from "@/modules/students/utils/formatters";

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

function getPageNumbers(page: number, totalPages: number) {
  const pages: (number | "ellipsis")[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (page > 3) pages.push("ellipsis");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages, page + 1);
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) pages.push(i);
  }

  if (page < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

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
  const totalCount = total || students.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const showPagination = totalCount > pageSize && totalPages > 1;

  if (loading) {
    return (
      <div className="animate-pulse" aria-hidden>
        <StudentsTableSkeleton rows={pageSize} />
      </div>
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
                          s.photoUrl ||
                          "https://i.pinimg.com/736x/2a/bd/c4/2abdc427589317e312e55100ac612ace.jpg"
                        }
                        alt={s.name ? `${s.name} avatar` : "Avatar"}
                        width={72}
                        height={72}
                        className="rounded-full h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="text-[14px]">{s.name ?? "-"}</div>
                      <div className="text-[12px] text-[#737373]">
                        Id-{s.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 hidden lg:table-cell">
                  <div className="flex">
                    <div className="border border-[#D7E3FC] max-w-full px-2 py-1 rounded-full">
                      {formatClassSection(s.className, s.section, "-")}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 hidden lg:table-cell">
                  {formatDisplayDate(s.createdAt)}
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
        </Table>
      </div>

      {showPagination && (
        <>
          <div className="border-t border-[#D7E3FC] mt-4" />

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-4">
            <div className="text-sm text-slate-600">
              Showing {students.length} of {totalCount}
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                {getPageNumbers(page, totalPages).map((pageNumber, idx) => (
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
                      onPageChange(Math.min(totalPages, page + 1))
                    }
                    disabled={page >= totalPages}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
