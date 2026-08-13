"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  FeeSubnav,
  useFeePayments,
  downloadAdminReceipt,
  formatInr,
  PAYMENT_METHOD_LABELS,
} from "@/modules/fees";

export default function AdminFeePaymentsPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, error, refetch } = useFeePayments({
    page,
    limit: 10,
    search: search || undefined,
  });
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-[600] text-[#021034]">Payments</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          Payment ledger and receipt downloads
        </p>
      </div>

      <FeeSubnav />

      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded border border-slate-200 bg-white px-3 py-2 text-sm"
          placeholder="Search receipt / student"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {isLoading ? (
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-24", cellWidth: "w-28" },
          ]}
        />
      ) : error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load payments.</p>
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
                  <th className="py-2 pr-3">Receipt</th>
                  <th className="py-2 pr-3">Student</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2 pr-3">Method</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-slate-500">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  data?.data.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-3">
                        <div className="font-medium text-[#021034]">
                          {row.receiptNumber}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(row.paidAt).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {row.studentName ?? row.studentUserId}
                        <div className="text-xs text-slate-500">
                          {row.feeStructureName ?? ""}
                        </div>
                      </td>
                      <td className="py-3 pr-3">{formatInr(row.amount)}</td>
                      <td className="py-3 pr-3">
                        {PAYMENT_METHOD_LABELS[row.method] ?? row.method}
                      </td>
                      <td className="py-3">
                        <button
                          className="text-blue-700 hover:underline"
                          onClick={async () => {
                            try {
                              await downloadAdminReceipt(row.id);
                            } catch (err) {
                              toast({
                                title: "Download failed",
                                description:
                                  err instanceof Error
                                    ? err.message
                                    : undefined,
                                type: "error",
                              });
                            }
                          }}
                        >
                          Receipt
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
    </div>
  );
}
