"use client";

import { use } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { formatPercent, useMyReportCard } from "@/modules/exams";

export default function StudentReportCardPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const { data, isLoading, error, refetch } = useMyReportCard(examId);

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Report card
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            {data?.exam.name ?? "…"}
          </p>
        </div>
        <Link href="/student/exams">
          <Button variant="ghost">Back</Button>
        </Link>
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={6}
          columns={[
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-16", cellWidth: "w-20" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">
              Failed to load report card. It may not be published yet.
            </p>
            <Button variant="dark" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-[#021034]">
              {data?.studentName}
            </h2>
            {data?.result ? (
              <p className="mt-2 text-sm">
                Overall: {data.result.totalObtainedMarks}/
                {data.result.totalMaxMarks} (
                {formatPercent(data.result.percentage)}) · Grade{" "}
                {data.result.grade ?? "—"} · Rank {data.result.rank ?? "—"}
              </p>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Subject</th>
                  <th className="py-2 pr-3">Marks</th>
                  <th className="py-2 pr-3">Grade</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data!.subjects.map((s) => (
                  <tr key={s.subjectId} className="border-t border-slate-100">
                    <td className="py-3 pr-3 font-medium text-[#021034]">
                      {s.subjectName}
                    </td>
                    <td className="py-3 pr-3">
                      {s.isAbsent
                        ? "Absent"
                        : `${s.marksObtained ?? "—"}/${s.maxMarks}`}
                    </td>
                    <td className="py-3 pr-3">{s.grade ?? "—"}</td>
                    <td className="py-3">
                      {s.isAbsent
                        ? "Absent"
                        : s.isPassed
                          ? "Pass"
                          : "Fail"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
