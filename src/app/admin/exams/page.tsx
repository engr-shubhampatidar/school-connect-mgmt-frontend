"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileCheck2,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatCardsGridSkeleton } from "@/components/skeletons";
import {
  ExamSubnav,
  EXAM_STATUS_LABELS,
  examStatusClass,
  formatClassLabel,
  useExamDashboard,
} from "@/modules/exams";

export default function AdminExamsDashboardPage() {
  const { data, isLoading, error, refetch } = useExamDashboard();

  return (
    <div className="mx-auto px-4 py-6 ">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Exams & Results
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Dashboard, schedules, marks, and report cards
          </p>
        </div>
        <Link href="/admin/exams/list">
          <Button variant="dark">Manage exams</Button>
        </Link>
      </div>

      <ExamSubnav />

      {isLoading ? (
        <StatCardsGridSkeleton count={4} />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3 p-2">
            <p className="text-sm text-slate-700">
              Failed to load exam dashboard.
            </p>
            <Button variant="dark" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total exams"
              value={String(data?.totalExams ?? 0)}
              icon={BookOpen}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
            <StatCard
              label="Scheduled"
              value={String(data?.scheduledCount ?? 0)}
              icon={CalendarDays}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
            <StatCard
              label="Pending marks"
              value={String(data?.pendingMarksCount ?? 0)}
              icon={ClipboardCheck}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
            <StatCard
              label="Published"
              value={String(data?.publishedCount ?? 0)}
              icon={FileCheck2}
              className="bg-white border-[#BFDBFE]"
              iconBgColor="bg-[#BFDBFE]"
              progressLabel=" "
            />
          </section>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-3 text-base font-semibold text-[#021034]">
                Upcoming schedules
              </h2>
              {(data?.upcomingSchedules ?? []).length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming sittings.</p>
              ) : (
                <ul className="space-y-2">
                  {data!.upcomingSchedules.map((s) => (
                    <li
                      key={s.scheduleId}
                      className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium text-[#021034]">
                          {s.examName} · {s.subjectName}
                        </p>
                        <p className="text-slate-500">
                          {s.className ?? "—"} · {s.examDate}
                          {s.startTime ? ` ${s.startTime}` : ""}
                        </p>
                      </div>
                      <Link href={`/admin/exams/${s.examId}/schedule`}>
                        <Button variant="ghost">View</Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="mb-3 text-base font-semibold text-[#021034]">
                Recent exams
              </h2>
              {(data?.recentExams ?? []).length === 0 ? (
                <p className="text-sm text-slate-500">No exams yet.</p>
              ) : (
                <ul className="space-y-2">
                  {data!.recentExams.map((exam) => (
                    <li
                      key={exam.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium text-[#021034]">
                          {exam.name}
                        </p>
                        <p className="text-slate-500">
                          {formatClassLabel(exam.className, exam.classSection)}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${examStatusClass(exam.status)}`}
                      >
                        {EXAM_STATUS_LABELS[exam.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
