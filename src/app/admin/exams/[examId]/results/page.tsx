"use client";

import { use, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  ExamSubnav,
  formatPercent,
  useExam,
  useExamMutations,
  useExamResults,
  formatClassLabel,
} from "@/modules/exams";

export default function ExamResultsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const examQuery = useExam(examId);
  const resultsQuery = useExamResults(examId, {
    page,
    limit: 10,
    search: search || undefined,
  });
  const mutations = useExamMutations();
  const totalPages = Math.max(1, Math.ceil((resultsQuery.data?.total ?? 0) / 10));

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Results</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            {examQuery.data?.name ?? "…"} ·{" "}
            {formatClassLabel(
              examQuery.data?.className,
              examQuery.data?.classSection,
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            disabled={mutations.generateResults.isPending}
            onClick={() =>
              void mutations.generateResults
                .mutateAsync(examId)
                .then(() =>
                  toast({ title: "Results generated", type: "success" }),
                )
                .catch((err: unknown) => {
                  const msg =
                    (err as { response?: { data?: { message?: string } } })
                      ?.response?.data?.message ?? "Generate failed";
                  toast({ title: String(msg), type: "error" });
                })
            }
          >
            Generate
          </Button>
          <Button
            variant="dark"
            disabled={mutations.publishResults.isPending}
            onClick={() =>
              void mutations.publishResults
                .mutateAsync(examId)
                .then(() =>
                  toast({ title: "Results published", type: "success" }),
                )
                .catch((err: unknown) => {
                  const msg =
                    (err as { response?: { data?: { message?: string } } })
                      ?.response?.data?.message ?? "Publish failed";
                  toast({ title: String(msg), type: "error" });
                })
            }
          >
            Publish
          </Button>
        </div>
      </div>

      <ExamSubnav examId={examId} />

      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search students"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {resultsQuery.isLoading ? (
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-10", cellWidth: "w-12" },
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-16", cellWidth: "w-20" },
          ]}
        />
      ) : resultsQuery.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load results.</p>
            <Button variant="dark" onClick={() => void resultsQuery.refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Rank</th>
                  <th className="py-2 pr-3">Student</th>
                  <th className="py-2 pr-3">Obtained</th>
                  <th className="py-2 pr-3">%</th>
                  <th className="py-2 pr-3">Grade</th>
                  <th className="py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {(resultsQuery.data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No results yet. Generate after marks entry.
                    </td>
                  </tr>
                ) : (
                  resultsQuery.data!.data.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="py-3 pr-3">{r.rank ?? "—"}</td>
                      <td className="py-3 pr-3 font-medium text-[#021034]">
                        {r.studentName}
                      </td>
                      <td className="py-3 pr-3">
                        {r.totalObtainedMarks}/{r.totalMaxMarks}
                      </td>
                      <td className="py-3 pr-3">
                        {formatPercent(r.percentage)}
                      </td>
                      <td className="py-3 pr-3">{r.grade ?? "—"}</td>
                      <td className="py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            r.isPassed
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {r.isPassed ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
