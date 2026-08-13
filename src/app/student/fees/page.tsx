"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  useMyFees,
  useMyFeePayments,
  useMyFeesSummary,
  downloadMyReceipt,
  formatInr,
  FEE_STATUS_LABELS,
  FEE_FREQUENCY_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/modules/fees";

export default function StudentFeesPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"dues" | "history">("dues");
  const summary = useMyFeesSummary();
  const fees = useMyFees({ page: 1, limit: 50 });
  const payments = useMyFeePayments({ page: 1, limit: 50 });

  return (
    <div className="mx-auto px-4 py-6 bg-[#F5F9FF] min-h-full">
      <div className="mb-4">
        <h1 className="text-[24px] font-[600] text-[#021034]">My Fees</h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          View outstanding dues and download receipts
        </p>
      </div>

      {summary.isLoading ? (
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-[#D7E3FC] bg-white"
            />
          ))}
        </div>
      ) : summary.data ? (
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "Outstanding",
              value: formatInr(summary.data.totalOutstanding),
            },
            { label: "Paid", value: formatInr(summary.data.totalPaid) },
            {
              label: "Pending",
              value: String(summary.data.pendingCount),
            },
            {
              label: "Overdue",
              value: String(summary.data.overdueCount),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#D7E3FC] bg-white px-4 py-3"
            >
              <p className="text-xs text-[#737373]">{stat.label}</p>
              <p className="mt-1 text-lg font-semibold text-[#021034]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "dues"
              ? "bg-[#DBEAFE] text-[#021034]"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          onClick={() => setTab("dues")}
        >
          Dues
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "history"
              ? "bg-[#DBEAFE] text-[#021034]"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
          onClick={() => setTab("history")}
        >
          Payment history
        </button>
      </div>

      {tab === "dues" ? (
        fees.isLoading ? (
          <DataTableSkeleton
            rows={5}
            columns={[
              { headerWidth: "w-32", cellWidth: "w-40" },
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-24" },
            ]}
          />
        ) : fees.error ? (
          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-700">Failed to load fees.</p>
              <Button variant="dark" onClick={() => void fees.refetch()}>
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
                    <th className="py-2 pr-3">Fee</th>
                    <th className="py-2 pr-3">Outstanding</th>
                    <th className="py-2 pr-3">Frequency</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(fees.data?.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-slate-500">
                        No fee assignments
                      </td>
                    </tr>
                  ) : (
                    fees.data?.data.map((row) => (
                      <tr key={row.id} className="border-t">
                        <td className="py-3 pr-3">
                          <div className="font-medium text-[#021034]">
                            {row.feeStructureName ?? "—"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {row.categoryName ?? ""}
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          {formatInr(row.outstandingAmount)}
                          <div className="text-xs text-slate-500">
                            Paid {formatInr(row.paidAmount)} · Fine{" "}
                            {formatInr(row.fineAmount)}
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          {FEE_FREQUENCY_LABELS[row.frequency] ?? row.frequency}
                        </td>
                        <td className="py-3">
                          {FEE_STATUS_LABELS[row.status] ?? row.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : payments.isLoading ? (
        <DataTableSkeleton
          rows={5}
          columns={[
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
            { headerWidth: "w-20", cellWidth: "w-24" },
          ]}
        />
      ) : payments.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load payments.</p>
            <Button variant="dark" onClick={() => void payments.refetch()}>
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
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2 pr-3">Method</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(payments.data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-slate-500">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  payments.data?.data.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-3">
                        {row.receiptNumber}
                        <div className="text-xs text-slate-500">
                          {new Date(row.paidAt).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="py-3 pr-3">{formatInr(row.amount)}</td>
                      <td className="py-3 pr-3">
                        {PAYMENT_METHOD_LABELS[row.method] ?? row.method}
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          className="text-blue-700 hover:underline"
                          onClick={async () => {
                            try {
                              await downloadMyReceipt(row.id);
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
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
