"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { fetchClasses, type ClassItem } from "@/modules/classes";
import {
  FeeSubnav,
  CollectPaymentDialog,
  useStudentFees,
  useFeeStructures,
  useFeeMutations,
  formatInr,
  FEE_STATUS_LABELS,
} from "@/modules/fees";
import type { StudentFee } from "@/modules/fees";
import { useEffect } from "react";

export default function AdminFeeCollectPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [status, setStatus] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [collectTarget, setCollectTarget] = useState<StudentFee | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [studentUserId, setStudentUserId] = useState("");
  const [feeStructureId, setFeeStructureId] = useState("");
  const [bulkClassId, setBulkClassId] = useState("");
  const [bulkStructureId, setBulkStructureId] = useState("");

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      classId: classId || undefined,
      status: status || undefined,
    }),
    [page, search, classId, status],
  );

  const { data, isLoading, error, refetch } = useStudentFees(query);
  const structures = useFeeStructures({ page: 1, limit: 100 });
  const mutations = useFeeMutations();
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
            Assign fees and record offline payments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => setBulkOpen(true)}>
            Bulk assign
          </Button>
          <Button variant="dark" onClick={() => setAssignOpen(true)}>
            Assign fee
          </Button>
        </div>
      </div>

      <FeeSubnav />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="w-full max-w-xs rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search student / fee"
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
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load assignments.</p>
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
                  <th className="py-2 pr-3">Fee</th>
                  <th className="py-2 pr-3">Outstanding</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-slate-500">
                      No fee assignments found
                    </td>
                  </tr>
                ) : (
                  data?.data.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-3">
                        <Link
                          href={`/admin/fees/students/${row.studentUserId}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {row.studentName ?? row.studentUserId}
                        </Link>
                        <div className="text-xs text-slate-500">
                          {row.studentCode ?? ""}
                          {row.className ? ` · ${row.className}` : ""}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div>{row.feeStructureName ?? "—"}</div>
                        <div className="text-xs text-slate-500">
                          Due {row.dueDate?.slice(0, 10)}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {formatInr(row.outstandingAmount)}
                      </td>
                      <td className="py-3 pr-3">
                        {FEE_STATUS_LABELS[row.status] ?? row.status}
                      </td>
                      <td className="py-3">
                        <button
                          className="text-blue-700 hover:underline disabled:opacity-40"
                          disabled={
                            row.status === "PAID" || row.status === "WAIVED"
                          }
                          onClick={() => setCollectTarget(row)}
                        >
                          Collect
                        </button>
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

      <CollectPaymentDialog
        open={Boolean(collectTarget)}
        studentFee={collectTarget}
        onClose={() => setCollectTarget(null)}
        onSubmit={async (values) => {
          await mutations.collect.mutateAsync(values);
          toast({ title: "Payment recorded", type: "success" });
        }}
      />

      {assignOpen ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45">
          <div className="w-[90%] max-w-lg rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-[#021034]">Assign fee</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-slate-600">
                  Student user ID
                </label>
                <input
                  className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  value={studentUserId}
                  onChange={(e) => setStudentUserId(e.target.value)}
                  placeholder="UUID of student user"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Fee structure</label>
                <select
                  className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  value={feeStructureId}
                  onChange={(e) => setFeeStructureId(e.target.value)}
                >
                  <option value="">Select</option>
                  {(structures.data?.data ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAssignOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={async () => {
                  try {
                    await mutations.assign.mutateAsync({
                      studentUserId,
                      feeStructureId,
                    });
                    toast({ title: "Fee assigned", type: "success" });
                    setAssignOpen(false);
                    setStudentUserId("");
                    setFeeStructureId("");
                  } catch (err) {
                    toast({
                      title: "Assign failed",
                      description:
                        err instanceof Error ? err.message : undefined,
                      type: "error",
                    });
                  }
                }}
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {bulkOpen ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45">
          <div className="w-[90%] max-w-lg rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-[#021034]">
              Bulk assign by class
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-slate-600">Class</label>
                <select
                  className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  value={bulkClassId}
                  onChange={(e) => setBulkClassId(e.target.value)}
                >
                  <option value="">Select</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.section ? `-${c.section}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600">Fee structure</label>
                <select
                  className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  value={bulkStructureId}
                  onChange={(e) => setBulkStructureId(e.target.value)}
                >
                  <option value="">Select</option>
                  {(structures.data?.data ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setBulkOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={async () => {
                  try {
                    const result = await mutations.bulkAssign.mutateAsync({
                      classId: bulkClassId,
                      feeStructureId: bulkStructureId,
                    });
                    toast({
                      title: "Bulk assign complete",
                      description: `Assigned ${result.assigned}, skipped ${result.skipped}`,
                      type: "success",
                    });
                    setBulkOpen(false);
                  } catch (err) {
                    toast({
                      title: "Bulk assign failed",
                      description:
                        err instanceof Error ? err.message : undefined,
                      type: "error",
                    });
                  }
                }}
              >
                Assign class
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
