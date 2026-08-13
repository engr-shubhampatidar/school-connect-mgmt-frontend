"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import {
  formatPercent,
  useMyExamResults,
} from "@/modules/exams";

export default function StudentExamsPage() {
  const { data, isLoading, error, refetch } = useMyExamResults();

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-[24px] font-[600] text-[#021034]">My exams</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          Published results and report cards
        </p>
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={6}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load results.</p>
            <Button variant="dark" onClick={() => void refetch()}>
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
                  <th className="py-2 pr-3">Exam</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Class</th>
                  <th className="py-2 pr-3">%</th>
                  <th className="py-2 pr-3">Grade</th>
                  <th className="py-2">Report card</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No published results yet.
                    </td>
                  </tr>
                ) : (
                  data!.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="py-3 pr-3 font-medium text-[#021034]">
                        {r.examName}
                      </td>
                      <td className="hidden py-3 pr-3 md:table-cell">
                        {r.className ?? "—"}
                      </td>
                      <td className="py-3 pr-3">
                        {formatPercent(r.percentage)}
                      </td>
                      <td className="py-3 pr-3">{r.grade ?? "—"}</td>
                      <td className="py-3">
                        <Link href={`/student/exams/${r.examId}`}>
                          <Button variant="ghost">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
