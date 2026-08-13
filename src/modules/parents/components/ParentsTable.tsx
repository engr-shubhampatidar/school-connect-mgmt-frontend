"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Parent } from "@/modules/parents/types";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = {
  parents: Parent[];
  loading: boolean;
  error: string | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
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
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) pages.push(i);
  }

  if (page < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

function ParentsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg bg-white border border-[#D7E3FC] p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function ParentsTable({
  parents,
  loading,
  error,
  total = 0,
  page = 1,
  pageSize = 10,
  onRetry,
  onPageChange,
}: Props) {
  const router = useRouter();
  const totalCount = total || parents.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const showPagination = totalCount > pageSize && totalPages > 1;

  if (loading) {
    return <ParentsTableSkeleton rows={pageSize} />;
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

  if (!parents || parents.length === 0) {
    return (
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">No parents found</h3>
          <p className="mt-1 text-sm text-slate-600">
            Try adjusting filters or add a new parent.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-lg bg-white border border-[#D7E3FC]">
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Parent Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden lg:table-cell">Mobile</TableHead>
              <TableHead className="hidden lg:table-cell">Children</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parents.map((p) => (
              <TableRow
                key={p.id}
                className="border-t border-[#D7E3FC] text-[#021034] text-[14px] font-[500] hover:bg-slate-50"
              >
                <TableCell className="pl-6">
                  <div className="font-medium text-slate-900">
                    {p.fullName || `${p.firstName} ${p.lastName}`}
                  </div>
                </TableCell>
                <TableCell className="text-[#737373]">{p.email}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {p.mobile ?? "-"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {p.childrenCount ?? 0}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {p.status ?? "-"}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/parents/${p.id}`)}
                  >
                    View
                  </Button>
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
              Showing {parents.length} of {totalCount}
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
