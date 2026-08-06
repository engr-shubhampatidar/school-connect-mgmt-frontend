"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";
import {
  HomeworkStatusBadge,
  HomeworkSubnav,
  HOMEWORK_TYPE_LABELS,
  formatDueAt,
  useHomeworkDetail,
  useHomeworkMutations,
} from "@/modules/homework";

type Props = {
  params: Promise<{ homeworkId: string }>;
  scope: "admin" | "teacher";
};

export function HomeworkDetailView({ params, scope }: Props) {
  const { homeworkId } = use(params);
  const basePath = scope === "admin" ? "/admin/homework" : "/teacher/homework";
  const { data, isLoading, isError } = useHomeworkDetail(scope, homeworkId);
  const mutations = useHomeworkMutations(scope);
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-600">Loading…</div>;
  }
  if (isError || !data) {
    return <div className="p-6 text-sm text-red-600">Homework not found.</div>;
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">{data.title}</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            {HOMEWORK_TYPE_LABELS[data.type]} · Due {formatDueAt(data.dueAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`${basePath}/${homeworkId}/submissions`}>
            <Button variant="dark">View submissions</Button>
          </Link>
          {data.status === "DRAFT" && (
            <Button
              variant="ghost"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await mutations.setStatus.mutateAsync({
                    id: homeworkId,
                    status: "PUBLISHED",
                  });
                  toast({ title: "Published", type: "success" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Publish
            </Button>
          )}
          {data.status === "PUBLISHED" && (
            <Button
              variant="ghost"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await mutations.setStatus.mutateAsync({
                    id: homeworkId,
                    status: "CLOSED",
                  });
                  toast({ title: "Closed", type: "success" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      <HomeworkSubnav basePath={basePath} homeworkId={homeworkId} />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <HomeworkStatusBadge status={data.status} />
            {data.allowLateSubmission ? (
              <span className="text-xs text-slate-500">Late allowed</span>
            ) : (
              <span className="text-xs text-slate-500">No late submissions</span>
            )}
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
            <div className="text-slate-500">Classes</div>
            <div className="font-medium text-[#021034]">
              {data.classes
                .map(
                  (c) => `${c.className}${c.section ? `-${c.section}` : ""}`,
                )
                .join(", ") || "—"}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Created by</div>
            <div className="font-medium text-[#021034]">
              {data.createdByName || "—"}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Submissions</div>
            <div className="font-medium text-[#021034]">
              {data.submissionCount ?? 0} total · {data.reviewedCount ?? 0}{" "}
              reviewed
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
