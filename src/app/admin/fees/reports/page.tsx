"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { fetchClasses, type ClassItem } from "@/modules/classes";
import {
  FeeSubnav,
  useFeeReport,
  useFeeCategories,
  formatInr,
  toCsv,
  downloadBlob,
} from "@/modules/fees";

export default function AdminFeeReportsPage() {
  const { toast } = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [classId, setClassId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const { data, isLoading, error, refetch } = useFeeReport({
    from: from || undefined,
    to: to || undefined,
    classId: classId || undefined,
    categoryId: categoryId || undefined,
  });
  const categories = useFeeCategories({ page: 1, limit: 100 });

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
            Fee reports
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Collection and outstanding breakdown
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => {
            if (!data?.rows?.length) {
              toast({ title: "Nothing to export", type: "info" });
              return;
            }
            const csv = toCsv(
              data.rows.map((r) => ({
                category: r.categoryName ?? "",
                class: r.className ?? "",
                collected: r.collected,
                outstanding: r.outstanding,
                overdueCount: r.overdueCount,
                studentCount: r.studentCount,
              })),
            );
            downloadBlob(
              new Blob([csv], { type: "text/csv;charset=utf-8" }),
              "fee-report.csv",
            );
          }}
        >
          Export CSV
        </Button>
      </div>

      <FeeSubnav />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="date"
          className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <select
          className="rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
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
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {(categories.data?.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={6}
          columns={[
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load report.</p>
            <Button variant="dark" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">Collected</p>
              <p className="mt-1 text-xl font-semibold text-[#021034]">
                {formatInr(data?.totalCollected ?? 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Outstanding</p>
              <p className="mt-1 text-xl font-semibold text-[#021034]">
                {formatInr(data?.totalOutstanding ?? 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Overdue count</p>
              <p className="mt-1 text-xl font-semibold text-[#021034]">
                {data?.overdueCount ?? 0}
              </p>
            </Card>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3">Class</th>
                    <th className="py-2 pr-3">Collected</th>
                    <th className="py-2 pr-3">Outstanding</th>
                    <th className="py-2 pr-3">Overdue</th>
                    <th className="py-2">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.rows ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-slate-500">
                        No report rows
                      </td>
                    </tr>
                  ) : (
                    data?.rows.map((row, idx) => (
                      <tr
                        key={`${row.categoryId}-${row.classId}-${idx}`}
                        className="border-t"
                      >
                        <td className="py-3 pr-3">
                          {row.categoryName ?? "School Fee"}
                        </td>
                        <td className="py-3 pr-3">{row.className ?? "—"}</td>
                        <td className="py-3 pr-3">
                          {formatInr(row.collected)}
                        </td>
                        <td className="py-3 pr-3">
                          {formatInr(row.outstanding)}
                        </td>
                        <td className="py-3 pr-3">{row.overdueCount}</td>
                        <td className="py-3">{row.studentCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
