"use client";

import { use } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { StatCardsGridSkeleton, DataTableSkeleton } from "@/components/skeletons";
import StatCard from "@/components/admin/StatCard";
import {
  ExamSubnav,
  formatClassLabel,
  formatPercent,
  useClassReport,
  useExam,
} from "@/modules/exams";
import { Users, Percent, CheckCircle2, XCircle } from "lucide-react";

export default function ExamClassReportPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const examQuery = useExam(examId);
  const reportQuery = useClassReport(examId);

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-[600] text-[#021034]">Class report</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          {examQuery.data?.name ?? "…"} ·{" "}
          {formatClassLabel(
            examQuery.data?.className,
            examQuery.data?.classSection,
          )}
        </p>
      </div>

      <ExamSubnav examId={examId} />

      {reportQuery.isLoading ? (
        <>
          <StatCardsGridSkeleton count={4} />
          <div className="mt-4">
            <DataTableSkeleton
              rows={5}
              columns={[
                { headerWidth: "w-32", cellWidth: "w-40" },
                { headerWidth: "w-20", cellWidth: "w-24" },
                { headerWidth: "w-20", cellWidth: "w-24" },
              ]}
            />
          </div>
        </>
      ) : reportQuery.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load class report.</p>
            <Button variant="dark" onClick={() => void reportQuery.refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Students"
              value={String(reportQuery.data?.totalStudents ?? 0)}
              icon={Users}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
            <StatCard
              label="Class average"
              value={formatPercent(
                reportQuery.data?.classAveragePercentage ?? 0,
              )}
              icon={Percent}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
            <StatCard
              label="Passed"
              value={String(reportQuery.data?.passCount ?? 0)}
              icon={CheckCircle2}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
            <StatCard
              label="Failed"
              value={String(reportQuery.data?.failCount ?? 0)}
              icon={XCircle}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
          </section>

          <Card className="mt-6">
            <h2 className="mb-3 text-base font-semibold text-[#021034]">
              Subject-wise performance
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-3">Subject</th>
                    <th className="py-2 pr-3">Avg marks</th>
                    <th className="py-2 pr-3">Avg %</th>
                    <th className="py-2 pr-3">Pass</th>
                    <th className="py-2 pr-3">Fail</th>
                    <th className="py-2 pr-3">Absent</th>
                    <th className="py-2 pr-3">High</th>
                    <th className="py-2">Low</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportQuery.data?.subjects ?? []).map((s) => (
                    <tr key={s.subjectId} className="border-t border-slate-100">
                      <td className="py-3 pr-3 font-medium text-[#021034]">
                        {s.subjectName}
                      </td>
                      <td className="py-3 pr-3">{s.averageMarks}</td>
                      <td className="py-3 pr-3">
                        {formatPercent(s.averagePercentage)}
                      </td>
                      <td className="py-3 pr-3">{s.passCount}</td>
                      <td className="py-3 pr-3">{s.failCount}</td>
                      <td className="py-3 pr-3">{s.absentCount}</td>
                      <td className="py-3 pr-3">{s.highestMarks}</td>
                      <td className="py-3">{s.lowestMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
