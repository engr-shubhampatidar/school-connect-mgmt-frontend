"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  HOMEWORK_TYPE_LABELS,
  HomeworkStatusBadge,
  SubmissionStatusBadge,
  formatDueAt,
  isOverdue,
  type HomeworkStatus,
  type HomeworkType,
} from "@/modules/homework";
import { PARENT_PORTAL_PAGE_SIZE } from "@/modules/parent-portal/constants/query-keys";
import { useChildHomeworkQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildHomeworkListView({
  studentId,
}: {
  studentId: string;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<HomeworkType | "">("");
  const [status, setStatus] = useState<HomeworkStatus | "">("");

  const listQuery = useChildHomeworkQuery(studentId, {
    page,
    limit: PARENT_PORTAL_PAGE_SIZE,
    search: search.trim() || undefined,
    type: type || undefined,
    status: status || undefined,
  });

  const rows = listQuery.data?.data ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PARENT_PORTAL_PAGE_SIZE));

  if (listQuery.isLoading && rows.length === 0) {
    return <PortalLoading rows={3} />;
  }

  if (listQuery.error && rows.length === 0) {
    return (
      <PortalError
        message={formatErrorMessage(listQuery.error, "Failed to load homework")}
        onRetry={() => void listQuery.refetch()}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Homework"
        description="Assigned work and submission status (read-only)"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className="rounded-md border border-[#D7E3FC] px-3 py-2 text-sm"
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value as HomeworkType | "");
          }}
        >
          <option value="">All types</option>
          <option value="HOMEWORK">Homework</option>
          <option value="ASSIGNMENT">Assignment</option>
        </select>
        <select
          className="rounded-md border border-[#D7E3FC] px-3 py-2 text-sm"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as HomeworkStatus | "");
          }}
        >
          <option value="">Open & closed</option>
          <option value="PUBLISHED">Published</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="grid gap-3">
        {listQuery.isLoading ? (
          <Card className="p-5 text-sm text-slate-600">Loading…</Card>
        ) : rows.length === 0 ? (
          <PortalEmpty title="No homework assigned yet." />
        ) : (
          rows.map((row) => (
            <Card key={row.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/parent/children/${studentId}/homework/${row.id}`}
                      className="text-base font-semibold text-[#021034] hover:underline"
                    >
                      {row.title}
                    </Link>
                    <HomeworkStatusBadge status={row.status} />
                    {row.mySubmissionStatus ? (
                      <SubmissionStatusBadge status={row.mySubmissionStatus} />
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {HOMEWORK_TYPE_LABELS[row.type]}
                    {row.subjectName ? ` · ${row.subjectName}` : ""}
                    {" · Due "}
                    {formatDueAt(row.dueAt)}
                    {isOverdue(row.dueAt, row.status) ? (
                      <span className="text-orange-600"> · Overdue</span>
                    ) : null}
                  </p>
                </div>
                <Link
                  href={`/parent/children/${studentId}/homework/${row.id}`}
                >
                  <Button variant="dark">View</Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>

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
    </PortalPageShell>
  );
}
