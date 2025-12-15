"use client";
import React, { useCallback, useEffect, useState } from "react";
import { fetchSubjects, Subject, SubjectsQuery } from "../../../lib/adminApi";
import Button from "../../../components/ui/Button";
import AddSubjectDialog from "./components/AddSubjectDialog";
import Card from "../../../components/ui/Card";

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
        setSubjects(resp.subjects ?? []);
        setTotal(resp.total ?? resp.subjects.length ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    const q: SubjectsQuery = { page, pageSize };
    void load(q);
  }, [page, pageSize, load]);

  const [creatingOpen, setCreatingOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Subjects</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage subjects offered by the school
          </p>
        </div>

        <div>
          <Button onClick={() => setCreatingOpen(true)}>Add Subject</Button>
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
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="text-left py-2">Subject Name</th>
                    <th className="text-left py-2">Subject Code</th>
                    <th className="text-left py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-3">
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      </td>
                      <td className="py-3">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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
                <Button onClick={() => setCreatingOpen(true)}>
                  Add Subject
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="text-left py-2">Subject Name</th>
                    <th className="text-left py-2">Subject Code</th>
                    <th className="text-left py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-slate-50">
                      <td className="py-3">{s.name}</td>
                      <td className="py-3">{s.code}</td>
                      <td className="py-3">
                        {s.createdAt
                          ? new Intl.DateTimeFormat(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }).format(new Date(s.createdAt))
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {subjects.length} of {total ?? subjects.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-slate-700">Page {page}</div>
                <Button onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
