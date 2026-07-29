"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Teacher } from "@/modules/teachers/types/admin";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { TeachersTableSkeleton } from "@/modules/teachers/components/skeletons/TeachersPageSkeleton";
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
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onRetry?: () => void;
  onPageChange: (page: number) => void;
  onEdit?: (id: string) => void;
  onResendInvite?: (id: string) => void;
};

export default function TeachersTable({
  teachers,
  loading,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onEdit,
  onResendInvite,
}: Props) {
  const totalCount = total || teachers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const showPagination = totalCount > pageSize && totalPages > 1;

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

  const router = useRouter();

  if (loading) {
    return (
      <div className="animate-pulse" aria-hidden>
        <TeachersTableSkeleton rows={pageSize} />
      </div>
    );
  }
  // Empty state when there are no teachers to show
  if (!teachers || teachers.length === 0) {
    // Main table rendering
    return (
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">
            No teachers found
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Try adjusting filters or add a new teacher.
          </p>
        </div>
      </Card>
    );
  }

  console.log(teachers);

  return (
    <div className="rounded-lg bg-white border border-[#D7E3FC] ">
      <div className="overflow-x-auto ">
        <table className="w-full table-auto ">
          <thead className="sticky top-0  ">
            <tr>
              <th className="text-left py-4 pl-6 w-48 hidden lg:table-cell">
                Id No.
              </th>
              <th className="text-left py-4 px-4">Teacher Name</th>
              <th className="text-left py-4 px-4">Contact No.</th>
              <th className="text-left py-4 hidden lg:table-cell">
                Class Teacher
              </th>
              <th className="text-left py-4 hidden lg:table-cell">Assigned Classes & Subjects</th>
              <th className="text-right py-4 pr-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr
                key={t.id}
                className="border-t border-[#D7E3FC] text-[#021034] text-[14px] font-[500] hover:bg-slate-50"
              >
                <td className="py-3 hidden lg:table-cell p-6">{t?.employeeId}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="View teacher details"
                      title="View details"
                    >
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
                          <div className="text-[14px]">
                            {t.name ?? "-"}
                          </div>
                          <div className="text-[12px] text-[#737373]">
                            {t.user?.email ?? t.email ?? "-"}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </td>
                <td className="py-3 hidden lg:table-cell">
                  {t?.phone}
                </td>
                <td className="py-3 hidden lg:table-cell">
                  {t.classTeacher?.name
                    ? `${t.classTeacher.name}${
                        t.classTeacher.section
                          ? " - " + t.classTeacher.section
                          : ""
                      }`
                    : t.classes && t.classes.length
                    ? `${t.classes[0].className}${
                        t.classes[0].classSection
                          ? " - " + t.classes[0].classSection
                          : ""
                      }`
                    : "-"}
                </td>
                <td className="py-3 hidden lg:table-cell">
                  {t.assignedClasses ?? "-"}
                </td>
                <td className="py-3 flex justify-end pr-6">
                  <div className="flex gap-2">
                    <Button
                    className="cursor-pointer"
                      variant="ghost"
                      onClick={() => {
                       router.push(`/admin/teachers/profile/${t.id}`);
                      }}
                    >
                      Veiw Profile
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <>
          <div className="border-t border-[#D7E3FC] mt-4" />
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-4">
            <div className="text-sm text-slate-600">
              Showing {teachers.length} of {totalCount}
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
        </>
      )}
    </div>
  );
}

// Drawer is rendered above and controlled via state in this component.
