"use client";
import { useCallback, useEffect, useState } from "react";
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

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const load = useCallback(
    async (q?: SubjectsQuery) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchSubjects(q ?? { page, pageSize });
        setSubjects(resp.subjects);
        setTotal(resp.total ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize],
  );

  useEffect(() => {
    const q: SubjectsQuery = { page, pageSize };
    void load(q);
  }, [page, pageSize, load]);

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(total / pageSize));
    if (page > tp) {
      setPage(tp);
    }
  }, [total, pageSize, page]);

  const [creatingOpen, setCreatingOpen] = useState(false);

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
    </div>
  );
}
