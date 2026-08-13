"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  HOMEWORK_TYPE_LABELS,
  HomeworkStatusBadge,
  SubmissionStatusBadge,
  formatDueAt,
} from "@/modules/homework";
import { useChildHomeworkDetailQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildHomeworkDetailView({
  studentId,
  homeworkId,
}: {
  studentId: string;
  homeworkId: string;
}) {
  const { data, isLoading, error, refetch } = useChildHomeworkDetailQuery(
    studentId,
    homeworkId,
  );

  if (isLoading) return <PortalLoading rows={3} />;
  if (error || !data) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Homework not found")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title={data.title}
        description={`${HOMEWORK_TYPE_LABELS[data.type]} · Due ${formatDueAt(data.dueAt)}`}
        actions={
          <Link href={`/parent/children/${studentId}/homework`}>
            <Button variant="ghost">Back to list</Button>
          </Link>
        }
      />

      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Read-only view. Parents cannot submit homework on behalf of students.
      </p>

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
          Student submission
        </h2>
        {!data.mySubmission ? (
          <p className="text-sm text-slate-600">Not submitted yet.</p>
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
    </PortalPageShell>
  );
}
