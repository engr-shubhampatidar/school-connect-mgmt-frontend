"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  HOMEWORK_PAGE_SIZE,
  HOMEWORK_TYPE_LABELS,
  HomeworkStatusBadge,
  HomeworkSubnav,
  SubmissionStatusBadge,
  formatDueAt,
  isOverdue,
  useStudentHomeworkList,
  type HomeworkStatus,
  type HomeworkType,
} from "@/modules/homework";

export default function StudentHomeworkPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<HomeworkType | "">("");
  const [status, setStatus] = useState<HomeworkStatus | "">("");

  const listQuery = useStudentHomeworkList({
    page,
    limit: HOMEWORK_PAGE_SIZE,
    search: search.trim() || undefined,
    type: type || undefined,
    status: status || undefined,
  });

  const rows = listQuery.data?.data ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / HOMEWORK_PAGE_SIZE));

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-[600] text-[#021034]">My Homework</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          View assigned work, check due dates, and submit your answers.
        </p>
      </div>

      <HomeworkSubnav basePath="/student/homework" />

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
          <Card className="p-5 text-sm text-slate-600">
            No homework assigned yet.
          </Card>
        ) : (
          rows.map((row) => (
            <Card key={row.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/student/homework/${row.id}`}
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
                <Link href={`/student/homework/${row.id}`}>
                  <Button variant="dark">Open</Button>
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
    </div>
  );
}
