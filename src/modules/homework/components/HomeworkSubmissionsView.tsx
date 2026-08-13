"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";
import {
  HomeworkSubnav,
  ReviewDialog,
  SubmissionStatusBadge,
  formatDueAt,
  useHomeworkDetail,
  useHomeworkMutations,
  useHomeworkSubmissions,
  type HomeworkSubmission,
  type ReviewSubmissionPayload,
  type SubmissionStatus,
} from "@/modules/homework";

type Props = {
  params: Promise<{ homeworkId: string }>;
  scope: "admin" | "teacher";
};

export function HomeworkSubmissionsView({ params, scope }: Props) {
  const { homeworkId } = use(params);
  const basePath = scope === "admin" ? "/admin/homework" : "/teacher/homework";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "">("");
  const [reviewing, setReviewing] = useState<HomeworkSubmission | null>(null);
  const { toast } = useToast();

  const detail = useHomeworkDetail(scope, homeworkId);
  const submissions = useHomeworkSubmissions(scope, homeworkId, {
    page,
    limit: 20,
    search: search.trim() || undefined,
    status: status || undefined,
  });
  const mutations = useHomeworkMutations(scope);

  const rows = submissions.data?.data ?? [];
  const total = submissions.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const onReview = async (payload: ReviewSubmissionPayload) => {
    if (!reviewing) return;
    await mutations.review.mutateAsync({
      homeworkId,
      submissionId: reviewing.id,
      payload,
    });
    toast({ title: "Review saved", type: "success" });
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-[600] text-[#021034]">
          {detail.data?.title ?? "Submissions"}
        </h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          Review student work, assign marks, and leave remarks.
        </p>
      </div>

      <HomeworkSubnav basePath={basePath} homeworkId={homeworkId} />

      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search student…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className="rounded-md border border-[#D7E3FC] px-3 py-2 text-sm"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as SubmissionStatus | "");
          }}
        >
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="LATE">Late</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      <Card className="overflow-x-auto p-0">
        {submissions.isLoading ? (
          <div className="p-6 text-sm text-slate-600">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">No submissions yet.</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E8EEF9] bg-[#F8FBFF] text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Marks</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#F1F5F9] align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#021034]">
                      {row.studentName || "—"}
                    </div>
                    {row.content ? (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {row.content}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{row.className || "—"}</td>
                  <td className="px-4 py-3">
                    {row.submittedAt ? formatDueAt(row.submittedAt) : "—"}
                    {row.isLate ? (
                      <div className="text-xs text-orange-600">Late</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <SubmissionStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    {row.marksObtained ?? "—"}
                    {row.remarks ? (
                      <div className="mt-1 text-xs text-slate-500">
                        {row.remarks}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {(row.status === "SUBMITTED" ||
                      row.status === "LATE" ||
                      row.status === "RETURNED" ||
                      row.status === "REVIEWED") && (
                      <Button variant="ghost" onClick={() => setReviewing(row)}>
                        Review
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {page} of {totalPages} · {total} total
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <ReviewDialog
        open={Boolean(reviewing)}
        submission={reviewing}
        maxMarks={detail.data?.maxMarks}
        onClose={() => setReviewing(null)}
        onSubmit={onReview}
      />
    </div>
  );
}
