"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { formatPercent } from "@/modules/exams";
import {
  useChildExamResultsQuery,
  useChildExamScheduleQuery,
  useChildReportCardQuery,
} from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildExamsView({ studentId }: { studentId: string }) {
  const [tab, setTab] = useState<"schedule" | "results">("schedule");
  const [reportExamId, setReportExamId] = useState<string | null>(null);

  const scheduleQuery = useChildExamScheduleQuery(studentId);
  const resultsQuery = useChildExamResultsQuery(studentId);
  const reportQuery = useChildReportCardQuery(
    studentId,
    reportExamId ?? undefined,
  );

  if (scheduleQuery.isLoading && resultsQuery.isLoading) {
    return <PortalLoading rows={3} />;
  }

  if (scheduleQuery.error && resultsQuery.error) {
    return (
      <PortalError
        message={formatErrorMessage(scheduleQuery.error, "Failed to load exams")}
        onRetry={() => {
          void scheduleQuery.refetch();
          void resultsQuery.refetch();
        }}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Exams"
        description="Schedule and published results (read-only)"
      />

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "schedule"
              ? "bg-[#DBEAFE] text-[#021034]"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          onClick={() => {
            setTab("schedule");
            setReportExamId(null);
          }}
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

      {reportExamId ? (
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#021034]">
              Report card
              {reportQuery.data?.exam.name
                ? ` · ${reportQuery.data.exam.name}`
                : ""}
            </h2>
            <Button variant="ghost" onClick={() => setReportExamId(null)}>
              Back to results
            </Button>
          </div>
          {reportQuery.isLoading ? (
            <DataTableSkeleton
              rows={6}
              columns={[
                { headerWidth: "w-32", cellWidth: "w-40" },
                { headerWidth: "w-20", cellWidth: "w-24" },
                { headerWidth: "w-16", cellWidth: "w-20" },
              ]}
            />
          ) : reportQuery.error ? (
            <Card>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-700">
                  Failed to load report card. It may not be published yet.
                </p>
                <Button
                  variant="dark"
                  onClick={() => void reportQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="mb-4 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-semibold text-[#021034]">
                  {reportQuery.data?.studentName}
                </h3>
                {reportQuery.data?.result ? (
                  <p className="mt-2 text-sm">
                    Overall: {reportQuery.data.result.totalObtainedMarks}/
                    {reportQuery.data.result.totalMaxMarks} (
                    {formatPercent(reportQuery.data.result.percentage)}) · Grade{" "}
                    {reportQuery.data.result.grade ?? "—"} · Rank{" "}
                    {reportQuery.data.result.rank ?? "—"}
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
                    {reportQuery.data!.subjects.map((s) => (
                      <tr
                        key={s.subjectId}
                        className="border-t border-slate-100"
                      >
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
      ) : tab === "schedule" ? (
        scheduleQuery.isLoading ? (
          <DataTableSkeleton
            rows={5}
            columns={[
              { headerWidth: "w-40", cellWidth: "w-48" },
              { headerWidth: "w-28", cellWidth: "w-32" },
            ]}
          />
        ) : scheduleQuery.error ? (
          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-700">Failed to load schedule.</p>
              <Button
                variant="dark"
                onClick={() => void scheduleQuery.refetch()}
              >
                Retry
              </Button>
            </div>
          </Card>
        ) : (scheduleQuery.data ?? []).length === 0 ? (
          <PortalEmpty title="No exam schedule available" />
        ) : (
          <div className="space-y-4">
            {(scheduleQuery.data ?? []).map((group) => (
              <Card key={group.exam.id}>
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-[#021034]">
                    {group.exam.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {group.exam.academicYear}
                    {group.exam.className ? ` · ${group.exam.className}` : ""}
                    {group.exam.status ? ` · ${group.exam.status}` : ""}
                  </p>
                </div>
                {(group.schedules ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">No subjects scheduled.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500">
                          <th className="py-2 pr-3">Subject</th>
                          <th className="py-2 pr-3">Date</th>
                          <th className="py-2 pr-3">Time</th>
                          <th className="py-2">Venue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.schedules.map((s) => (
                          <tr key={s.id} className="border-t border-slate-100">
                            <td className="py-3 pr-3 font-medium text-[#021034]">
                              {s.subjectName ?? "—"}
                            </td>
                            <td className="py-3 pr-3">
                              {s.examDate
                                ? new Date(s.examDate).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "—"}
                            </td>
                            <td className="py-3 pr-3">
                              {s.startTime ?? "—"}
                              {s.endTime ? `–${s.endTime}` : ""}
                            </td>
                            <td className="py-3">{s.venue ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      ) : resultsQuery.isLoading ? (
        <DataTableSkeleton
          rows={6}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
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
                  <th className="py-2 pr-3">Exam</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Class</th>
                  <th className="py-2 pr-3">%</th>
                  <th className="py-2 pr-3">Grade</th>
                  <th className="py-2">Report card</th>
                </tr>
              </thead>
              <tbody>
                {(resultsQuery.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No published results yet.
                    </td>
                  </tr>
                ) : (
                  resultsQuery.data!.map((r) => (
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
                        <Button
                          variant="ghost"
                          onClick={() => setReportExamId(r.examId)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PortalPageShell>
  );
}
