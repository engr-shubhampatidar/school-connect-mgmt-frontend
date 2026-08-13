"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { fetchClasses, type ClassItem } from "@/modules/classes";
import {
  AssignFeesDialog,
  FeeSubnav,
  useStudentFeeSummaries,
  useFeeMutations,
  formatInr,
  FEE_STATUS_LABELS,
} from "@/modules/fees";

export default function AdminFeeCollectPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [status, setStatus] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      classId: classId || undefined,
    }),
    [page, search, classId],
  );

  const { data, isLoading, error, refetch } = useStudentFeeSummaries(query);
  const mutations = useFeeMutations();

  const rows = useMemo(() => {
    const all = data?.data ?? [];
    if (!status) return all;
    return all.filter((row) => row.statusSummary === status);
  }, [data?.data, status]);

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  useEffect(() => {
    void fetchClasses({ page: 1, pageSize: 100 })
      .then((res) => setClasses(res.classes ?? []))
      .catch(() => setClasses([]));
  }, []);

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">
            Fee collection
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            View student balances and collect payments from student detail
          </p>
        </div>
        <Button variant="dark" onClick={() => setAssignOpen(true)}>
          Assign fees
        </Button>
      </div>

      <FeeSubnav />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="w-full max-w-xs rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search student"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          value={classId}
          onChange={(e) => {
            setPage(1);
            setClassId(e.target.value);
          }}
        >
          <option value="">All classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.section ? `-${c.section}` : ""}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partial</option>
          <option value="OVERDUE">Overdue</option>
          <option value="PAID">Paid</option>
          <option value="WAIVED">Waived</option>
        </select>
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-20", cellWidth: "w-24" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load students.</p>
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
                  <th className="py-2 pr-3">Student</th>
                  <th className="py-2 pr-3">Class</th>
                  <th className="py-2 pr-3">Total outstanding</th>
                  <th className="py-2 pr-3">Next due</th>
                  <th className="py-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-slate-500">
                      No students with fee assignments found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.studentUserId} className="border-t">
                      <td className="py-3 pr-3">
                        <Link
                          href={`/admin/fees/students/${row.studentUserId}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {row.studentName ?? row.studentUserId}
                        </Link>
                        <div className="text-xs text-slate-500">
                          {row.studentCode ?? ""}
                          {row.pendingInstallmentCount > 0
                            ? ` · ${row.pendingInstallmentCount} due`
                            : ""}
                        </div>
                      </td>
                      <td className="py-3 pr-3">{row.className ?? "—"}</td>
                      <td className="py-3 pr-3">
                        {formatInr(row.totalOutstanding)}
                      </td>
                      <td className="py-3 pr-3">
                        {row.nextDueDate?.slice(0, 10) ?? "—"}
                      </td>
                      <td className="py-3 pr-3">
                        {FEE_STATUS_LABELS[row.statusSummary] ??
                          row.statusSummary}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {data?.total ?? 0} total
            </p>
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
        </Card>
      )}

      <AssignFeesDialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssignStudent={async (payload) => {
          await mutations.assignPackage.mutateAsync(payload);
          toast({ title: "Fees assigned", type: "success" });
        }}
        onBulkAssignClass={async (payload) => {
          const result = await mutations.bulkAssignPackage.mutateAsync(payload);
          toast({
            title: "Bulk assign complete",
            description: `Assigned ${result.assigned}, skipped ${result.skipped}`,
            type: "success",
          });
        }}
      />
    </div>
  );
}
