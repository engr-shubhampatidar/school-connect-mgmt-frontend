"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import {
  FEE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  formatInr,
} from "@/modules/fees";
import {
  useChildFeePaymentsQuery,
  useChildFeesQuery,
  useChildFeesSummaryQuery,
} from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildFeesView({ studentId }: { studentId: string }) {
  const [tab, setTab] = useState<"dues" | "history">("dues");
  const summaryQuery = useChildFeesSummaryQuery(studentId);
  const feesQuery = useChildFeesQuery(studentId, { page: 1, limit: 50 });
  const paymentsQuery = useChildFeePaymentsQuery(studentId, {
    page: 1,
    limit: 50,
  });

  if (summaryQuery.isLoading && feesQuery.isLoading) {
    return <PortalLoading rows={3} />;
  }

  if (summaryQuery.error && feesQuery.error) {
    return (
      <PortalError
        message={formatErrorMessage(summaryQuery.error, "Failed to load fees")}
        onRetry={() => {
          void summaryQuery.refetch();
          void feesQuery.refetch();
        }}
      />
    );
  }

  const summary = summaryQuery.data;

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Fees"
        description="Outstanding dues and payment history (read-only)"
      />

      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Fees are view-only. Contact the school office to make payments.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="text-sm text-slate-500">Outstanding</div>
          <div className="mt-2 text-xl font-semibold text-[#021034]">
            {formatInr(summary?.totalOutstanding)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Paid</div>
          <div className="mt-2 text-xl font-semibold text-[#021034]">
            {formatInr(summary?.totalPaid)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Pending</div>
          <div className="mt-2 text-xl font-semibold text-[#021034]">
            {summary?.pendingCount ?? 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Overdue</div>
          <div className="mt-2 text-xl font-semibold text-[#021034]">
            {summary?.overdueCount ?? 0}
          </div>
        </Card>
      </div>

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
        feesQuery.isLoading ? (
          <DataTableSkeleton
            rows={5}
            columns={[
              { headerWidth: "w-32", cellWidth: "w-40" },
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-24" },
            ]}
          />
        ) : feesQuery.error ? (
          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-700">Failed to load fees.</p>
              <Button variant="dark" onClick={() => void feesQuery.refetch()}>
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
                    <th className="py-2 pr-3">Due date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(feesQuery.data?.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-slate-500">
                        No fee assignments
                      </td>
                    </tr>
                  ) : (
                    feesQuery.data!.data.map((row) => (
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
                          {row.dueDate?.slice(0, 10)}
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
      ) : paymentsQuery.isLoading ? (
        <DataTableSkeleton
          rows={5}
          columns={[
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-20", cellWidth: "w-24" },
          ]}
        />
      ) : paymentsQuery.error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">Failed to load payments.</p>
            <Button
              variant="dark"
              onClick={() => void paymentsQuery.refetch()}
            >
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
                  <th className="py-2">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {(paymentsQuery.data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-slate-500">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  paymentsQuery.data!.data.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-3">{row.receiptNumber}</td>
                      <td className="py-3 pr-3">{formatInr(row.amount)}</td>
                      <td className="py-3 pr-3">
                        {PAYMENT_METHOD_LABELS[row.method] ?? row.method}
                      </td>
                      <td className="py-3">
                        {new Date(row.paidAt).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PortalPageShell>
  );
}
