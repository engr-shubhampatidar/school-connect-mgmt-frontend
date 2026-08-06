"use client";

import { use, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import {
  FeeSubnav,
  CollectPaymentDialog,
  useStudentFees,
  useFeePayments,
  useFeeMutations,
  downloadAdminReceipt,
  formatInr,
  FEE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/modules/fees";
import type { StudentFee } from "@/modules/fees";

export default function AdminStudentFeeDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  const { toast } = useToast();
  const [collectTarget, setCollectTarget] = useState<StudentFee | null>(null);
  const [discountId, setDiscountId] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState("0");
  const [discountReason, setDiscountReason] = useState("");

  const fees = useStudentFees({
    page: 1,
    limit: 50,
    studentUserId: studentId,
  });
  const payments = useFeePayments({
    page: 1,
    limit: 50,
    studentUserId: studentId,
  });
  const mutations = useFeeMutations();

  const studentName =
    fees.data?.data?.[0]?.studentName ?? studentId;

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/fees/collect"
            className="text-sm text-blue-700 hover:underline"
          >
            ← Back to collection
          </Link>
          <h1 className="mt-1 text-[24px] font-[600] text-[#021034]">
            {studentName}
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Student fee details and payment history
          </p>
        </div>
      </div>

      <FeeSubnav />

      <section className="mb-6">
        <h2 className="mb-3 text-base font-semibold text-[#021034]">
          Fee assignments
        </h2>
        {fees.isLoading ? (
          <DataTableSkeleton
            rows={4}
            columns={[
              { headerWidth: "w-32", cellWidth: "w-40" },
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-24" },
              { headerWidth: "w-28", cellWidth: "w-32" },
            ]}
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-3">Fee</th>
                    <th className="py-2 pr-3">Outstanding</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(fees.data?.data ?? []).map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-3 pr-3">
                        <div className="font-medium">
                          {row.feeStructureName ?? "—"}
                        </div>
                        <div className="text-xs text-slate-500">
                          Base {formatInr(row.baseAmount)} · Discount{" "}
                          {formatInr(row.discountAmount)} · Fine{" "}
                          {formatInr(row.fineAmount)}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {formatInr(row.outstandingAmount)}
                      </td>
                      <td className="py-3 pr-3">
                        {FEE_STATUS_LABELS[row.status] ?? row.status}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="text-blue-700 hover:underline disabled:opacity-40"
                            disabled={
                              row.status === "PAID" || row.status === "WAIVED"
                            }
                            onClick={() => setCollectTarget(row)}
                          >
                            Collect
                          </button>
                          <button
                            className="text-blue-700 hover:underline"
                            onClick={() => {
                              setDiscountId(row.id);
                              setDiscountAmount(String(row.discountAmount));
                              setDiscountReason(row.discountReason ?? "");
                            }}
                          >
                            Discount
                          </button>
                          <button
                            className="text-red-600 hover:underline disabled:opacity-40"
                            disabled={
                              row.status === "PAID" || row.status === "WAIVED"
                            }
                            onClick={async () => {
                              try {
                                await mutations.waive.mutateAsync({
                                  id: row.id,
                                  reason: "Waived by admin",
                                });
                                toast({
                                  title: "Fee waived",
                                  type: "success",
                                });
                              } catch (err) {
                                toast({
                                  title: "Waive failed",
                                  description:
                                    err instanceof Error
                                      ? err.message
                                      : undefined,
                                  type: "error",
                                });
                              }
                            }}
                          >
                            Waive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-[#021034]">
          Payment history
        </h2>
        {payments.isLoading ? (
          <DataTableSkeleton
            rows={4}
            columns={[
              { headerWidth: "w-28", cellWidth: "w-32" },
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-24" },
              { headerWidth: "w-20", cellWidth: "w-24" },
            ]}
          />
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
                        No payments
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
                        <td className="py-3 pr-3">
                          {formatInr(row.amount)}
                        </td>
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
          </Card>
        )}
      </section>

      <CollectPaymentDialog
        open={Boolean(collectTarget)}
        studentFee={collectTarget}
        onClose={() => setCollectTarget(null)}
        onSubmit={async (values) => {
          await mutations.collect.mutateAsync(values);
          toast({ title: "Payment recorded", type: "success" });
        }}
      />

      {discountId ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45">
          <div className="w-[90%] max-w-md rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-[#021034]">
              Update discount
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-slate-600">Amount</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Reason</label>
                <input
                  className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDiscountId(null)}>
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={async () => {
                  try {
                    await mutations.updateDiscount.mutateAsync({
                      id: discountId,
                      payload: {
                        discountAmount: Number(discountAmount),
                        discountReason: discountReason || undefined,
                      },
                    });
                    toast({ title: "Discount updated", type: "success" });
                    setDiscountId(null);
                  } catch (err) {
                    toast({
                      title: "Update failed",
                      description:
                        err instanceof Error ? err.message : undefined,
                      type: "error",
                    });
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
