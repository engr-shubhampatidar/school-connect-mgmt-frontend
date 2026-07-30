"use client";
import React, { useState } from "react";
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
import type { ClassItem } from "@/modules/classes/types/classes";
import { AssignTeacherModal } from "@/modules/teachers";
import { ChevronDown, ChevronRight, CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  classes: ClassItem[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onEdit?: (id: string) => void;
  onAssignTeacher?: (id: string) => void;
  onChangeTeacher?: (id: string) => void;
};

export default function ClassesTable({
  classes,
  loading,
  error,
  total = 0,
  page = 1,
  pageSize = 10,
  onRetry,
  onPageChange,
  onAssignTeacher,
  onChangeTeacher,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClassId, setModalClassId] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<"assign" | "change" | null>(
    null,
  );
  const totalCount = total || classes.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const showPagination = totalCount > pageSize && totalPages > 1;
  const [openRow, setOpenRow] = useState<number | null>(null);
  const router = useRouter();

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const data = (classes || []).map((it: any) => {
    if (it && Array.isArray(it.sections)) {
      return {
        grade: it.gradeName ?? it.grade ?? it.name ?? "",
        sectionsCount: it.sections.length,
        students:
          typeof it.totalStudents === "number" ? it.totalStudents : undefined,
        status: it.status ?? "Active",
        sections: it.sections.map((s: any) => ({
          id: s.classId ?? s.id ?? "",
          classId: s.classId ?? s.id ?? "",
          name: s.sectionLabel ?? s.section ?? s.name ?? "",
          teacher: s.classTeacherName ?? s.classTeacher ?? s.teacher ?? null,
          students: s.totalStudents ?? s.students ?? 0,
        })),
      };
    }

    return {
      grade: it.gradeName ?? it.name ?? "",
      sectionsCount: it.section ? 1 : 0,
      students: undefined,
      status: it.classTeacherName ? "Assigned" : "Not Assigned",
      sections: [
        {
          name: it.sectionLabel ?? it.section ?? "",
          teacher: it.classTeacherName ?? null,
          students: 0,
        },
      ],
    };
  });

  if (loading) {
    return (
      <Card>
        <Table className="w-full table-auto">
          <TableHeader className="sticky top-0">
            <TableRow>
              <TableHead className="text-left py-4 pl-6 w-48 hidden lg:table-cell">
                Actions
              </TableHead>
              <TableHead className="text-left py-4 px-4">Class Name</TableHead>
              <TableHead className="text-left py-4 hidden lg:table-cell">
                Sections
              </TableHead>
              <TableHead className="text-left py-4 hidden lg:table-cell">
                Students
              </TableHead>
              <TableHead className="text-right py-4 pr-10">Status</TableHead>
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
                <TableCell className="py-3 text-right">
                  <div className="h-8 w-24 animate-pulse rounded bg-slate-200 ml-auto" />
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

  if (!classes || classes.length === 0) {
    return (
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">
            No classes created yet
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Create a class to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="bg-white rounded-lg border border-[#D7E3FC]">
        <div className="overflow-x-auto">
          <Table className="w-full table-auto">
            <TableHeader className="sticky top-0">
              <TableRow className="border-b border-[#D7E3FC]">
                <TableHead className="text-left py-4 pl-6 w-48">
                  Actions
                </TableHead>
                <TableHead className="text-left py-4 px-4">
                  Class Name
                </TableHead>
                <TableHead className="text-left py-4 hidden lg:table-cell">
                  Sections
                </TableHead>
                <TableHead className="text-left py-4 hidden lg:table-cell">
                  Students
                </TableHead>
                <TableHead className="text-right py-4 pr-10">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item, index) => {
                const isOpen = openRow === index;
                return (
                  <React.Fragment key={index}>
                    <TableRow
                      className={`bord border-[#D7E3FC] text-[#021034] text-[14px] font-[500] hover:bg-slate-50 ${
                        isOpen ? "bg-blue-50" : ""
                      }`}
                    >
                      <TableCell className="py-3 p-6 ">
                        <button
                          className="cursor-pointer"
                          onClick={() => setOpenRow(isOpen ? null : index)}
                        >
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </TableCell>

                      <TableCell className="p-3">
                        <div className="font-medium text-slate-900">
                          Grade: {item.grade}
                        </div>
                      </TableCell>

                      <TableCell className="py-3 hidden lg:table-cell">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                          {item.sectionsCount}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 hidden lg:table-cell">
                        {item.students ?? "-"}
                      </TableCell>

                      <TableCell className="py-3 flex justify-end pr-6">
                        <div className="inline-block px-3 py-1 rounded-full border border-[#D7E3FC] text-sm text-[#021034] font-[600]">
                          {item.status}
                        </div>
                      </TableCell>
                    </TableRow>

                    {isOpen && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="m-4 rounded-lg bg-[#D7E3FC]">
                            <p className="font-semibold text-[#021034] text-[16px] font-[600] p-4 border-b border-[#FFFFFF] flex items-center gap-2">
                              <CornerDownRight color="#475569" /> Section in
                              Grade: {item.grade}
                            </p>

                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-[#D7E3FC]">
                                  <TableHead className="text-left  px-4">
                                    Sections Name
                                  </TableHead>
                                  <TableHead className="text-left  px-4">
                                    Assigned Teacher
                                  </TableHead>
                                  <TableHead className="text-left  px-4">
                                    Student Count
                                  </TableHead>
                                  <TableHead className="text-right  pr-10">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>

                              <TableBody>
                                {item.sections.map((sec: any, i: number) => (
                                  <TableRow
                                    key={i}
                                    className="border-t border-[#FFFFFF] text-[#021034] text-[14px] font-[500] hover:bg-[#D7E3FC]"
                                  >
                                    <TableCell className="p-3">
                                      {sec.name}
                                    </TableCell>
                                    <TableCell className="p-3">
                                      {sec.teacher ?? "-"}
                                    </TableCell>
                                    <TableCell className="p-3">
                                      {sec.students}
                                    </TableCell>
                                    <TableCell className=" text-right">
                                      <Button
                                        className="cursor-pointer"
                                        variant="ghost"
                                        onClick={() => {
                                          const id =
                                            sec.classId ?? sec.id ?? "";
                                          if (id)
                                            router.push(
                                              `/admin/classes/${id}/overview`,
                                            );
                                        }}
                                      >
                                        overview
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {showPagination && (
          <>
            <div className="border-t border-[#D7E3FC] mt-4" />
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-4">
              <div className="text-sm text-slate-600">
                Showing {classes.length} of {totalCount}
              </div>
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
          </>
        )}
      </div>
      {modalClassId && (
        <AssignTeacherModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          classId={modalClassId}
          onSuccess={() => {
            if (modalAction === "assign") onAssignTeacher?.(modalClassId);
            if (modalAction === "change") onChangeTeacher?.(modalClassId);
            setModalOpen(false);
            setModalClassId(null);
            setModalAction(null);
          }}
        />
      )}
    </div>
  );
}
