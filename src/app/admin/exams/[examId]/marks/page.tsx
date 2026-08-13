"use client";

import { use, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  ExamSubnav,
  useExam,
  useExamMarks,
  useExamMutations,
  formatClassLabel,
  type UpsertMarkItem,
} from "@/modules/exams";

type CellState = {
  marksObtained: string;
  isAbsent: boolean;
};

export default function ExamMarksPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const { toast } = useToast();
  const examQuery = useExam(examId);
  const marksQuery = useExamMarks(examId);
  const mutations = useExamMutations();
  const [cells, setCells] = useState<Record<string, CellState>>({});

  const keyOf = (scheduleId: string, studentUserId: string) =>
    `${scheduleId}:${studentUserId}`;

  useEffect(() => {
    if (!marksQuery.data) return;
    const next: Record<string, CellState> = {};
    for (const student of marksQuery.data.students) {
      for (const schedule of marksQuery.data.schedules) {
        const existing = marksQuery.data.marks.find(
          (m) =>
            m.scheduleId === schedule.id &&
            m.studentUserId === student.studentUserId,
        );
        next[keyOf(schedule.id, student.studentUserId)] = {
          marksObtained:
            existing?.marksObtained === null ||
            existing?.marksObtained === undefined
              ? ""
              : String(existing.marksObtained),
          isAbsent: existing?.isAbsent ?? false,
        };
      }
    }
    setCells(next);
  }, [marksQuery.data]);

  const dirtyItems = useMemo(() => {
    const items: UpsertMarkItem[] = [];
    for (const [key, cell] of Object.entries(cells)) {
      const [scheduleId, studentUserId] = key.split(":");
      if (!scheduleId || !studentUserId) continue;
      if (cell.isAbsent) {
        items.push({ scheduleId, studentUserId, isAbsent: true });
      } else if (cell.marksObtained !== "") {
        items.push({
          scheduleId,
          studentUserId,
          isAbsent: false,
          marksObtained: Number(cell.marksObtained),
        });
      }
    }
    return items;
  }, [cells]);

  const handleSave = async () => {
    try {
      await mutations.upsertMarks.mutateAsync({
        examId,
        marks: dirtyItems,
      });
      toast({ title: "Marks saved", type: "success" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save marks";
      toast({ title: String(msg), type: "error" });
    }
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Marks entry</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            {examQuery.data?.name ?? "…"} ·{" "}
            {formatClassLabel(
              examQuery.data?.className,
              examQuery.data?.classSection,
            )}
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => void handleSave()}
          disabled={mutations.upsertMarks.isPending || dirtyItems.length === 0}
        >
          {mutations.upsertMarks.isPending ? "Saving…" : "Save marks"}
        </Button>
      </div>

      <ExamSubnav examId={examId} />

      {marksQuery.isLoading ? (
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : marksQuery.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load marks grid.</p>
            <Button variant="dark" onClick={() => void marksQuery.refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (marksQuery.data?.schedules.length ?? 0) === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            Add subject schedules before entering marks.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="sticky left-0 bg-white py-2 pr-3">Student</th>
                  {marksQuery.data!.schedules.map((s) => (
                    <th key={s.id} className="min-w-[140px] py-2 pr-3">
                      {s.subjectName}
                      <div className="text-xs font-normal">
                        /{s.maxMarks}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marksQuery.data!.students.map((student) => (
                  <tr
                    key={student.studentUserId}
                    className="border-t border-slate-100"
                  >
                    <td className="sticky left-0 bg-white py-2 pr-3 font-medium text-[#021034]">
                      {student.studentName}
                      {student.studentCode ? (
                        <div className="text-xs text-slate-500">
                          {student.studentCode}
                        </div>
                      ) : null}
                    </td>
                    {marksQuery.data!.schedules.map((schedule) => {
                      const key = keyOf(schedule.id, student.studentUserId);
                      const cell = cells[key] ?? {
                        marksObtained: "",
                        isAbsent: false,
                      };
                      return (
                        <td key={schedule.id} className="py-2 pr-3 align-top">
                          <div className="flex flex-col gap-1">
                            <input
                              type="number"
                              className="w-24 rounded border border-slate-200 px-2 py-1 text-sm disabled:bg-slate-50"
                              disabled={cell.isAbsent}
                              value={cell.marksObtained}
                              min={0}
                              max={schedule.maxMarks}
                              onChange={(e) =>
                                setCells((prev) => ({
                                  ...prev,
                                  [key]: {
                                    ...cell,
                                    marksObtained: e.target.value,
                                  },
                                }))
                              }
                            />
                            <label className="flex items-center gap-1 text-xs text-slate-500">
                              <input
                                type="checkbox"
                                checked={cell.isAbsent}
                                onChange={(e) =>
                                  setCells((prev) => ({
                                    ...prev,
                                    [key]: {
                                      marksObtained: "",
                                      isAbsent: e.target.checked,
                                    },
                                  }))
                                }
                              />
                              Absent
                            </label>
                          </div>
                        </td>
                      );
                    })}
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
