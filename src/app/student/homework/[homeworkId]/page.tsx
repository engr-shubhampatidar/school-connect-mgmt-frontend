"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";
import {
  HOMEWORK_TYPE_LABELS,
  HomeworkStatusBadge,
  HomeworkSubnav,
  SubmissionDialog,
  SubmissionStatusBadge,
  formatDueAt,
  useStudentHomeworkDetail,
  useSubmitHomeworkMutation,
  type SubmitHomeworkPayload,
} from "@/modules/homework";

export default function StudentHomeworkDetailPage({
  params,
}: {
  params: Promise<{ homeworkId: string }>;
}) {
  const { homeworkId } = use(params);
  const { data, isLoading, isError } = useStudentHomeworkDetail(homeworkId);
  const submitMutation = useSubmitHomeworkMutation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-600">Loading…</div>;
  }
  if (isError || !data) {
    return <div className="p-6 text-sm text-red-600">Homework not found.</div>;
  }

  const allowedToSubmit =
    data.status === "PUBLISHED" &&
    data.mySubmission?.status !== "REVIEWED";

  const onSubmit = async (payload: SubmitHomeworkPayload) => {
    await submitMutation.mutateAsync({ homeworkId, payload });
    toast({ title: "Submitted", type: "success" });
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">{data.title}</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            {HOMEWORK_TYPE_LABELS[data.type]} · Due {formatDueAt(data.dueAt)}
          </p>
        </div>
        {allowedToSubmit ? (
          <Button variant="dark" onClick={() => setOpen(true)}>
            {data.mySubmission ? "Resubmit" : "Submit"}
          </Button>
        ) : null}
      </div>

      <HomeworkSubnav basePath="/student/homework" />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <HomeworkStatusBadge status={data.status} />
            {data.mySubmissionStatus ? (
              <SubmissionStatusBadge status={data.mySubmissionStatus} />
            ) : null}
          </div>
          <h2 className="mb-2 text-sm font-semibold text-[#021034]">
            Instructions
          </h2>
          <p className="whitespace-pre-wrap text-sm text-slate-700">
            {data.description || "No description provided."}
          </p>
          {data.attachments?.length ? (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-[#021034]">
                Attachments
              </h3>
              <ul className="space-y-1 text-sm">
                {data.attachments.map((a, i) => (
                  <li key={`${a.url}-${i}`}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      {a.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-3 p-5 text-sm">
          <div>
            <div className="text-slate-500">Subject</div>
            <div className="font-medium text-[#021034]">
              {data.subjectName || "—"}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Max marks</div>
            <div className="font-medium text-[#021034]">
              {data.maxMarks ?? "—"}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Late submissions</div>
            <div className="font-medium text-[#021034]">
              {data.allowLateSubmission ? "Allowed" : "Not allowed"}
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#021034]">
          My submission
        </h2>
        {!data.mySubmission ? (
          <p className="text-sm text-slate-600">You have not submitted yet.</p>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <SubmissionStatusBadge status={data.mySubmission.status} />
              {data.mySubmission.isLate ? (
                <span className="text-xs text-orange-600">Late</span>
              ) : null}
              {data.mySubmission.submittedAt ? (
                <span className="text-slate-500">
                  {formatDueAt(data.mySubmission.submittedAt)}
                </span>
              ) : null}
            </div>
            <p className="whitespace-pre-wrap text-slate-700">
              {data.mySubmission.content || "No text content."}
            </p>
            {data.mySubmission.attachments?.length ? (
              <ul className="space-y-1">
                {data.mySubmission.attachments.map((a, i) => (
                  <li key={`${a.url}-${i}`}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      {a.filename}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {(data.mySubmission.marksObtained != null ||
              data.mySubmission.remarks) && (
              <div className="rounded-md border border-[#E8EEF9] bg-[#F8FBFF] p-3">
                <div>
                  Marks:{" "}
                  <span className="font-medium">
                    {data.mySubmission.marksObtained ?? "—"}
                  </span>
                </div>
                {data.mySubmission.remarks ? (
                  <div className="mt-1 text-slate-700">
                    Remarks: {data.mySubmission.remarks}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </Card>

      <SubmissionDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        initialContent={data.mySubmission?.content}
        initialAttachments={data.mySubmission?.attachments}
      />
    </div>
  );
}
