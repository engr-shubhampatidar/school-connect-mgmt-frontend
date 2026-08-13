"use client";

import { use } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  ExamSubnav,
  ScheduleDialog,
  useExam,
  useExamMutations,
  useExamSchedules,
  formatClassLabel,
} from "@/modules/exams";
import type { CreateScheduleValues } from "@/modules/exams";
import { useState } from "react";

export default function ExamSchedulePage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const examQuery = useExam(examId);
  const schedulesQuery = useExamSchedules(examId);
  const mutations = useExamMutations();

  const handleCreate = async (values: CreateScheduleValues) => {
    await mutations.createSchedule.mutateAsync({
      examId,
      payload: {
        subjectId: values.subjectId,
        examDate: values.examDate,
        startTime: values.startTime,
        endTime: values.endTime,
        maxMarks: Number(values.maxMarks),
        passMarks:
          values.passMarks === undefined
            ? undefined
            : Number(values.passMarks),
        venue: values.venue,
      },
    });
    toast({ title: "Schedule added", type: "success" });
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Exam schedule
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            {examQuery.data?.name ?? "…"} ·{" "}
            {formatClassLabel(
              examQuery.data?.className,
              examQuery.data?.classSection,
            )}
          </p>
        </div>
        <Button variant="dark" onClick={() => setDialogOpen(true)}>
          + Add subject
        </Button>
      </div>

      <ExamSubnav examId={examId} />

      {schedulesQuery.isLoading ? (
        <DataTableSkeleton
          rows={6}
          columns={[
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : schedulesQuery.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load schedule.</p>
            <Button
              variant="dark"
              onClick={() => void schedulesQuery.refetch()}
            >
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
                  <th className="py-2 pr-3">Subject</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Time</th>
                  <th className="py-2 pr-3">Max</th>
                  <th className="py-2 pr-3">Pass</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(schedulesQuery.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No subjects scheduled yet.
                    </td>
                  </tr>
                ) : (
                  schedulesQuery.data!.map((s) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="py-3 pr-3 font-medium text-[#021034]">
                        {s.subjectName}
                      </td>
                      <td className="py-3 pr-3">{s.examDate}</td>
                      <td className="hidden py-3 pr-3 md:table-cell">
                        {s.startTime || s.endTime
                          ? `${s.startTime ?? ""}–${s.endTime ?? ""}`
                          : "—"}
                      </td>
                      <td className="py-3 pr-3">{s.maxMarks}</td>
                      <td className="py-3 pr-3">{s.passMarks}</td>
                      <td className="py-3">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            void mutations.deleteSchedule
                              .mutateAsync({ examId, scheduleId: s.id })
                              .then(() =>
                                toast({
                                  title: "Schedule removed",
                                  type: "success",
                                }),
                              )
                              .catch(() =>
                                toast({
                                  title: "Failed to delete",
                                  type: "error",
                                }),
                              )
                          }
                        >
                          Delete
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

      <ScheduleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
