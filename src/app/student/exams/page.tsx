"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import {
  EXAM_STATUS_LABELS,
  EXAM_TYPE_LABELS,
  formatPercent,
  useMyExamResults,
  useMyExamSchedule,
  type ExamStatus,
  type ExamType,
} from "@/modules/exams";

export default function StudentExamsPage() {
  const [tab, setTab] = useState<"schedule" | "results">("schedule");
  const results = useMyExamResults();
  const schedule = useMyExamSchedule();

  return (
    <div className="mx-auto px-4 py-6 bg-[#F5F9FF] min-h-full">
      <div className="mb-6">
        <h1 className="text-[24px] font-[600] text-[#021034]">My exams</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          Upcoming schedule and published results
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "schedule"
              ? "bg-[#DBEAFE] text-[#021034]"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          onClick={() => setTab("schedule")}
        >
          Schedule
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "results"
              ? "bg-[#DBEAFE] text-[#021034]"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          onClick={() => setTab("results")}
        >
          Results
        </button>
      </div>

      {tab === "schedule" ? (
        schedule.isLoading ? (
          <DataTableSkeleton
            rows={6}
            columns={[
              { headerWidth: "w-32", cellWidth: "w-40" },
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-24" },
              { headerWidth: "w-24", cellWidth: "w-28" },
            ]}
          />
        ) : schedule.error ? (
          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-700">Failed to load schedule.</p>
              <Button variant="dark" onClick={() => void schedule.refetch()}>
                Retry
              </Button>
            </div>
          </Card>
        ) : (schedule.data ?? []).length === 0 ? (
          <Card>
            <p className="py-8 text-center text-sm text-slate-500">
              No exam schedule available yet.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {schedule.data!.map((group) => (
              <Card key={group.exam.id}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-[#021034]">
                    {group.exam.name}
                  </h2>
                  {group.exam.examType ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {EXAM_TYPE_LABELS[group.exam.examType as ExamType] ??
                        group.exam.examType}
                    </span>
                  ) : null}
                  {group.exam.status ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {EXAM_STATUS_LABELS[group.exam.status as ExamStatus] ??
                        group.exam.status}
                    </span>
                  ) : null}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="py-2 pr-3">Subject</th>
                        <th className="py-2 pr-3">Date</th>
                        <th className="hidden py-2 pr-3 md:table-cell">Time</th>
                        <th className="hidden py-2 pr-3 md:table-cell">
                          Venue
                        </th>
                        <th className="py-2">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.schedules.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-slate-500"
                          >
                            No subjects scheduled
                          </td>
                        </tr>
                      ) : (
                        group.schedules.map((s) => (
                          <tr
                            key={s.id}
                            className="border-t border-slate-100"
                          >
                            <td className="py-3 pr-3 font-medium text-[#021034]">
                              {s.subjectName ?? "—"}
                              {s.subjectCode ? (
                                <span className="ml-1 text-xs text-slate-400">
                                  ({s.subjectCode})
                                </span>
                              ) : null}
                            </td>
                            <td className="py-3 pr-3 whitespace-nowrap">
                              {s.examDate?.slice(0, 10) ?? "—"}
                            </td>
                            <td className="hidden py-3 pr-3 md:table-cell whitespace-nowrap">
                              {s.startTime ?? "—"}
                              {s.endTime ? `–${s.endTime}` : ""}
                            </td>
                            <td className="hidden py-3 pr-3 md:table-cell">
                              {s.venue ?? "—"}
                            </td>
                            <td className="py-3">
                              {s.maxMarks != null
                                ? `${s.passMarks ?? 0}/${s.maxMarks}`
                                : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : results.isLoading ? (
        <DataTableSkeleton
          rows={6}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : results.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load results.</p>
            <Button variant="dark" onClick={() => void results.refetch()}>
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
                {(results.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No published results yet.
                    </td>
                  </tr>
                ) : (
                  results.data!.map((r) => (
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
