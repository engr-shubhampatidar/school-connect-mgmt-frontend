"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  ExamDialog,
  ExamSubnav,
  EXAM_STATUS_LABELS,
  EXAM_TYPE_LABELS,
  examStatusClass,
  formatClassLabel,
  useExamMutations,
  useExams,
  type Exam,
  type ExamStatus,
} from "@/modules/exams";
import type { CreateExamValues } from "@/modules/exams";

const NEXT_STATUS: Partial<Record<ExamStatus, ExamStatus>> = {
  DRAFT: "SCHEDULED",
  SCHEDULED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

export default function AdminExamsListPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);

  const { data, isLoading, error, refetch } = useExams({
    page,
    limit: 10,
    search: search || undefined,
  });
  const mutations = useExamMutations();
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  const handleSave = async (values: CreateExamValues) => {
    if (editing) {
      await mutations.updateExam.mutateAsync({
        id: editing.id,
        payload: values,
      });
      toast({ title: "Exam updated", type: "success" });
    } else {
      await mutations.createExam.mutateAsync(values);
      toast({ title: "Exam created", type: "success" });
    }
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Exams</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Create and manage examinations
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          + Create exam
        </Button>
      </div>

      <ExamSubnav />

      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search exams"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-40", cellWidth: "w-48" },
            { headerWidth: "w-24", cellWidth: "w-28", hideOnMobile: true },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-32", cellWidth: "w-40" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load exams.</p>
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
                  <th className="py-2 pr-3">Name</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Class</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Type</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No exams found.
                    </td>
                  </tr>
                ) : (
                  data!.data.map((exam) => {
                    const next = NEXT_STATUS[exam.status];
                    return (
                      <tr key={exam.id} className="border-t border-slate-100">
                        <td className="py-3 pr-3 font-medium text-[#021034]">
                          {exam.name}
                          <div className="text-xs text-slate-500">
                            {exam.academicYear}
                          </div>
                        </td>
                        <td className="hidden py-3 pr-3 md:table-cell">
                          {formatClassLabel(exam.className, exam.classSection)}
                        </td>
                        <td className="hidden py-3 pr-3 md:table-cell">
                          {EXAM_TYPE_LABELS[exam.examType]}
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${examStatusClass(exam.status)}`}
                          >
                            {EXAM_STATUS_LABELS[exam.status]}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            <Link href={`/admin/exams/${exam.id}/schedule`}>
                              <Button variant="ghost">Open</Button>
                            </Link>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setEditing(exam);
                                setDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            {next ? (
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  void mutations.updateStatus
                                    .mutateAsync({
                                      id: exam.id,
                                      status: next,
                                    })
                                    .then(() =>
                                      toast({
                                        title: `Status → ${EXAM_STATUS_LABELS[next]}`,
                                        type: "success",
                                      }),
                                    )
                                    .catch((err: unknown) => {
                                      const msg =
                                        (err as { response?: { data?: { message?: string } } })
                                          ?.response?.data?.message ??
                                        "Status update failed";
                                      toast({
                                        title: String(msg),
                                        type: "error",
                                      });
                                    })
                                }
                              >
                                → {EXAM_STATUS_LABELS[next]}
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

      <ExamDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
        initial={editing}
      />
    </div>
  );
}
