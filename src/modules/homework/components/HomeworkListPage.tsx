"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";
import { fetchClasses } from "@/modules/classes/api/classes";
import { fetchSubjects } from "@/modules/subjects/api/subjects";
import { getTeacherDashboard } from "@/modules/teachers/api/portal";
import {
  HomeworkDialog,
  HomeworkStatusBadge,
  HomeworkSubnav,
  HOMEWORK_PAGE_SIZE,
  HOMEWORK_TYPE_LABELS,
  formatDueAt,
  useHomeworkList,
  useHomeworkMutations,
  type CreateHomeworkPayload,
  type Homework,
  type HomeworkStatus,
  type HomeworkType,
} from "@/modules/homework";

type Scope = "admin" | "teacher";

export function HomeworkListPage({ scope }: { scope: Scope }) {
  const basePath = scope === "admin" ? "/admin/homework" : "/teacher/homework";
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<HomeworkType | "">("");
  const [status, setStatus] = useState<HomeworkStatus | "">("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Homework | null>(null);

  const query = {
    page,
    limit: HOMEWORK_PAGE_SIZE,
    search: search.trim() || undefined,
    type: type || undefined,
    status: status || undefined,
  };

  const listQuery = useHomeworkList(scope, query);
  const mutations = useHomeworkMutations(scope);

  const optionsQuery = useQuery({
    queryKey: ["homework-form-options", scope],
    queryFn: async () => {
      if (scope === "admin") {
        const [classesRes, subjectsRes] = await Promise.all([
          fetchClasses({ page: 1, pageSize: 200 }),
          fetchSubjects({ page: 1, pageSize: 200 }),
        ]);
        return {
          classes: (classesRes.classes ?? []).map((c) => ({
            id: c.id,
            name: `${c.name}${c.section ? `-${c.section}` : ""}`,
          })),
          subjects: (subjectsRes.subjects ?? []).map((s) => ({
            id: s.id,
            name: s.name,
          })),
        };
      }

      const dashboard = await getTeacherDashboard();
      const classMap = new Map<string, string>();
      if (dashboard.assignedClass?.classId) {
        classMap.set(
          dashboard.assignedClass.classId,
          `${dashboard.assignedClass.class}${
            dashboard.assignedClass.section
              ? `-${dashboard.assignedClass.section}`
              : ""
          }`,
        );
      }
      for (const s of dashboard.assignedSubjects) {
        if (s.classId) {
          classMap.set(
            s.classId,
            `${s.class}${s.section ? `-${s.section}` : ""}`,
          );
        }
      }
      const subjectMap = new Map<string, string>();
      for (const s of dashboard.assignedSubjects) {
        if (s.subjectId) subjectMap.set(s.subjectId, s.subject);
      }
      return {
        classes: [...classMap.entries()].map(([id, name]) => ({ id, name })),
        subjects: [...subjectMap.entries()].map(([id, name]) => ({
          id,
          name,
        })),
      };
    },
  });

  const rows = listQuery.data?.data ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / HOMEWORK_PAGE_SIZE));

  const classOptions = useMemo(
    () => optionsQuery.data?.classes ?? [],
    [optionsQuery.data],
  );
  const subjectOptions = useMemo(
    () => optionsQuery.data?.subjects ?? [],
    [optionsQuery.data],
  );

  const save = async (payload: CreateHomeworkPayload) => {
    if (editing) {
      await mutations.update.mutateAsync({ id: editing.id, payload });
      toast({ title: "Updated", type: "success" });
    } else {
      await mutations.create.mutateAsync(payload);
      toast({ title: "Created", type: "success" });
    }
    setEditing(null);
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Homework & Assignments
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Create work, assign classes, track submissions and reviews.
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          + Create
        </Button>
      </div>

      <HomeworkSubnav basePath={basePath} />

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
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <Card className="overflow-x-auto p-0">
        {listQuery.isLoading ? (
          <div className="p-6 text-sm text-slate-600">Loading…</div>
        ) : listQuery.isError ? (
          <div className="p-6 text-sm text-red-600">Failed to load homework.</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">No homework found.</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E8EEF9] bg-[#F8FBFF] text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Classes</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#F1F5F9]">
                  <td className="px-4 py-3">
                    <Link
                      href={`${basePath}/${row.id}`}
                      className="font-medium text-[#021034] hover:underline"
                    >
                      {row.title}
                    </Link>
                    {row.subjectName ? (
                      <div className="text-xs text-slate-500">
                        {row.subjectName}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {HOMEWORK_TYPE_LABELS[row.type]}
                  </td>
                  <td className="px-4 py-3">{formatDueAt(row.dueAt)}</td>
                  <td className="px-4 py-3">
                    {row.classes
                      .map(
                        (c) =>
                          `${c.className}${c.section ? `-${c.section}` : ""}`,
                      )
                      .join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <HomeworkStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditing(row);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      {row.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            await mutations.setStatus.mutateAsync({
                              id: row.id,
                              status: "PUBLISHED",
                            });
                            toast({ title: "Published", type: "success" });
                          }}
                        >
                          Publish
                        </Button>
                      )}
                      {row.status === "PUBLISHED" && (
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            await mutations.setStatus.mutateAsync({
                              id: row.id,
                              status: "CLOSED",
                            });
                            toast({ title: "Closed", type: "success" });
                          }}
                        >
                          Close
                        </Button>
                      )}
                      <Link href={`${basePath}/${row.id}/submissions`}>
                        <Button variant="ghost">Submissions</Button>
                      </Link>
                    </div>
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

      <HomeworkDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={save}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        initial={editing}
      />
    </div>
  );
}
