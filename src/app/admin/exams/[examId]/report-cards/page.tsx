"use client";

import { use, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import {
  ExamSubnav,
  formatClassLabel,
  formatPercent,
  useExam,
  useExamMarks,
  useExamResults,
  useReportCard,
} from "@/modules/exams";

export default function ExamReportCardsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const examQuery = useExam(examId);
  const resultsQuery = useExamResults(examId, { page: 1, limit: 100 });
  const marksQuery = useExamMarks(examId);
  const reportQuery = useReportCard(examId, selectedStudentId);

  const students =
    (resultsQuery.data?.data ?? []).length > 0
      ? (resultsQuery.data?.data ?? []).map((r) => ({
          id: r.studentUserId,
          name: r.studentName ?? "",
          code: r.studentCode,
        }))
      : (marksQuery.data?.students ?? []).map((s) => ({
          id: s.studentUserId,
          name: s.studentName,
          code: s.studentCode,
        }));

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-[600] text-[#021034]">Report cards</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          {examQuery.data?.name ?? "…"} ·{" "}
          {formatClassLabel(
            examQuery.data?.className,
            examQuery.data?.classSection,
          )}
        </p>
      </div>

      <ExamSubnav examId={examId} />

      <div className="mb-4 max-w-md">
        <label className="mb-1 block text-sm text-slate-600">Student</label>
        <select
          className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
              {s.code ? ` (${s.code})` : ""}
            </option>
          ))}
        </select>
        {students.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">
            No students available for this exam yet.
          </p>
        ) : null}
      </div>

      {!selectedStudentId ? (
        <Card>
          <p className="text-sm text-slate-600">
            Select a student to view their report card.
          </p>
        </Card>
      ) : reportQuery.isLoading ? (
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
            <p className="text-sm text-slate-700">Failed to load report card.</p>
            <Button variant="dark" onClick={() => void reportQuery.refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-[#021034]">
              {reportQuery.data?.studentName}
            </h2>
            <p className="text-sm text-slate-500">
              {reportQuery.data?.studentCode ?? ""} ·{" "}
              {reportQuery.data?.exam.name}
            </p>
            {reportQuery.data?.result ? (
              <p className="mt-2 text-sm">
                Overall: {reportQuery.data.result.totalObtainedMarks}/
                {reportQuery.data.result.totalMaxMarks} (
                {formatPercent(reportQuery.data.result.percentage)}) · Grade{" "}
                {reportQuery.data.result.grade ?? "—"} · Rank{" "}
                {reportQuery.data.result.rank ?? "—"} ·{" "}
                <span
                  className={
                    reportQuery.data.result.isPassed
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {reportQuery.data.result.isPassed ? "Pass" : "Fail"}
                </span>
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
                      {s.isAbsent ? (
                        <span className="text-amber-700">Absent</span>
                      ) : s.isPassed ? (
                        <span className="text-green-700">Pass</span>
                      ) : (
                        <span className="text-red-700">Fail</span>
                      )}
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
