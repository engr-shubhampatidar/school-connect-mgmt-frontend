import type { Subject } from "@/modules/subjects/types/subjects";
import Card from "@/components/ui/Card";
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
  subjects: Subject[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function SubjectsTable({
  subjects,
  total,
  page,
  pageSize,
  onPageChange,
}: Props) {
  const totalCount = total || subjects.length;
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

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="text-left py-2">Subject Name</th>
              <th className="text-left py-2">Subject Code</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="py-3">{s.name}</td>
                <td className="py-3">{s.code}</td>
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
              Showing {subjects.length} of {totalCount}
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
    </Card>
  );
}
