"use client";

import { useCallback, useEffect, useState } from "react";
<<<<<<< HEAD
import { fetchSubjects, Subject, SubjectsQuery } from "../../../lib/adminApi";
import Button from "../../../components/ui/Button";
import AddSubjectDialog from "../../../components/admin/AddSubjectDialog";
import Card from "../../../components/ui/Card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
=======
import {
  fetchSubjects,
  type Subject,
  type SubjectsQuery,
  AddSubjectDialog,
  SubjectsTable,
  SubjectsPageSkeleton,
} from "@/modules/subjects";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
>>>>>>> c1cc93ee2eb9123dc290eba292710d8fe6429334

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [creatingOpen, setCreatingOpen] = useState(false);

<<<<<<< HEAD
  const totalPages = Math.max(
    1,
    Math.ceil((total || subjects.length) / pageSize),
  );

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
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

=======
>>>>>>> c1cc93ee2eb9123dc290eba292710d8fe6429334
  const load = useCallback(
    async (q?: SubjectsQuery) => {
      setLoading(true);
      setError(null);

      try {
        const resp = await fetchSubjects(q ?? { page, pageSize });
        setSubjects(resp.subjects);
        setTotal(resp.total ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load subjects");
        }
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize],
  );

  useEffect(() => {
    void load({ page, pageSize });
  }, [page, pageSize, load]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const isInitialLoad = loading && subjects.length === 0 && !error;

  if (isInitialLoad) {
    return <SubjectsPageSkeleton />;
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Subjects</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Manage subjects offered by the school
          </p>
        </div>

<<<<<<< HEAD
        <Button variant="dark" onClick={() => setCreatingOpen(true)}>
          Add Subject
        </Button>

        <AddSubjectDialog
          open={creatingOpen}
          onClose={() => setCreatingOpen(false)}
          onCreated={() => void load({ page, pageSize })}
        />
      </div>

      {loading ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="py-4 pl-6 text-left text-[14px] font-medium text-[#021034]">
                    Subject Name
                  </th>
                  <th className="px-4 py-4 text-left text-[14px] font-medium text-[#021034]">
                    Subject Code
                  </th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-6">
                      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    </td>
                    <td className="p-6">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-4">
            <p>Error: {error}</p>
            <Button onClick={() => void load({ page, pageSize })}>
              Retry
            </Button>
          </div>
        </Card>
      ) : subjects.length === 0 ? (
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium">No subjects found</h3>
            <p className="mt-2 text-sm text-slate-600">
              Add subjects to get started.
            </p>

            <Button
              className="mt-4"
              onClick={() => setCreatingOpen(true)}
            >
              Add Subject
            </Button>
          </div>
        </Card>
      ) : (
        <div className="rounded-lg border border-[#D7E3FC] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="py-4 pl-6 text-left text-[14px] font-medium text-[#021034]">
                    Subject Name
                  </th>
                  <th className="px-4 py-4 text-left text-[14px] font-medium text-[#021034]">
                    Subject Code
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-t border-[#D7E3FC] hover:bg-[#D7E3FC]"
                  >
                    <td className="p-6 font-semibold text-[#021034]">
                      {subject.name}
                    </td>
                    <td className="p-6 text-[#64748B]">
                      {subject.code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between px-6 pb-6">
            <div className="text-sm text-slate-600">
              Showing {subjects.length} of {total}
            </div>

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={pageNumber === page}
                        onClick={() => setPage(pageNumber)}
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
                      setPage(Math.min(totalPages, page + 1))
                    }
                    disabled={page >= totalPages}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
=======
        <div>
          <Button variant="dark" onClick={() => setCreatingOpen(true)}>
            + Add Subject
          </Button>
          <AddSubjectDialog
            open={creatingOpen}
            onClose={() => setCreatingOpen(false)}
            onCreated={() => {
              void load({ page, pageSize });
            }}
          />
        </div>
      </div>

      <div>
        {loading ? (
          <div className="animate-pulse" aria-hidden>
            <DataTableSkeleton
              rows={pageSize}
              columns={[
                { headerWidth: "w-32", cellWidth: "w-40" },
                { headerWidth: "w-28", cellWidth: "w-24" },
                { headerWidth: "w-24", cellWidth: "w-28", hideOnMobile: true },
              ]}
            />
          </div>
        ) : error ? (
          <Card>
            <div className="flex flex-col items-start gap-4">
              <div className="text-sm text-slate-700">Error: {error}</div>
              <Button onClick={() => load({ page, pageSize })}>Retry</Button>
            </div>
          </Card>
        ) : subjects.length === 0 ? (
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900">
                No subjects found
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Add subjects to get started.
              </p>
              <div className="mt-4">
                <Button variant="dark" onClick={() => setCreatingOpen(true)}>
                  + Add Subject
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <SubjectsTable
            subjects={subjects}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </div>
>>>>>>> c1cc93ee2eb9123dc290eba292710d8fe6429334
    </div>
  );
}