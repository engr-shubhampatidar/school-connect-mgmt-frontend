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
  useStudentFeeDetail,
  useFeePayments,
  useFeeMutations,
  downloadAdminReceipt,
  formatInr,
  FEE_STATUS_LABELS,
  FEE_FREQUENCY_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/modules/fees";
import type { StudentFeeCategoryDetail } from "@/modules/fees";

type CollectTarget = {
  feeInstallmentId: string;
  label: string;
  outstandingAmount: number;
};

export default function AdminStudentFeeDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  const { toast } = useToast();
  const [collectTarget, setCollectTarget] = useState<CollectTarget | null>(
    null,
  );
  const [discountCategory, setDiscountCategory] =
    useState<StudentFeeCategoryDetail | null>(null);
  const [discountAmount, setDiscountAmount] = useState("0");
  const [discountReason, setDiscountReason] = useState("");
  const [transportCategory, setTransportCategory] =
    useState<StudentFeeCategoryDetail | null>(null);
  const [transportKm, setTransportKm] = useState("");

  const detail = useStudentFeeDetail(studentId);
  const payments = useFeePayments({
    page: 1,
    limit: 50,
    studentUserId: studentId,
  });
  const mutations = useFeeMutations();

  const studentName = detail.data?.studentName ?? studentId;

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
            {detail.data?.studentCode ? `${detail.data.studentCode} · ` : ""}
            {detail.data?.className ?? "Student fee details"}
          </p>
        </div>
      </div>

      <FeeSubnav />

      <section className="mb-6 space-y-4">
        {detail.isLoading ? (
          <DataTableSkeleton
            rows={3}
            columns={[
              { headerWidth: "w-32", cellWidth: "w-40" },
              { headerWidth: "w-24", cellWidth: "w-28" },
              { headerWidth: "w-20", cellWidth: "w-24" },
            ]}
          />
        ) : detail.error ? (
          <Card>
            <p className="text-sm text-slate-700">Failed to load fee details.</p>
            <Button
              variant="dark"
              className="mt-3"
              onClick={() => void detail.refetch()}
            >
              Retry
            </Button>
          </Card>
        ) : (detail.data?.categories ?? []).length === 0 ? (
          <Card>
            <p className="text-sm text-slate-500">No fee assignments</p>
          </Card>
        ) : (
          detail.data?.categories.map((category) => (
            <Card key={category.studentFeeId}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[#021034]">
                    {category.categoryName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Annual {formatInr(category.annualAmount)} ·{" "}
                    {FEE_FREQUENCY_LABELS[category.frequency] ??
                      category.frequency}
                    {category.transportDistanceKm != null
                      ? ` · ${category.transportDistanceKm} km`
                      : ""}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Paid {formatInr(category.totalPaid)} · Outstanding{" "}
                    {formatInr(category.totalOutstanding)} ·{" "}
                    {FEE_STATUS_LABELS[category.aggregateStatus] ??
                      category.aggregateStatus}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="text-sm text-blue-700 hover:underline"
                    onClick={() => {
                      setDiscountCategory(category);
                      setDiscountAmount(
                        String(category.discountAmount ?? 0),
                      );
                      setDiscountReason(category.discountReason ?? "");
                    }}
                  >
                    Discount
                  </button>
                  {category.categoryType === "TRANSPORT" &&
                    category.aggregateStatus !== "PAID" &&
                    category.aggregateStatus !== "WAIVED" && (
                      <button
                        className="text-sm text-blue-700 hover:underline"
                        onClick={() => {
                          setTransportCategory(category);
                          setTransportKm(
                            category.transportDistanceKm != null
                              ? String(category.transportDistanceKm)
                              : "",
                          );
                        }}
                      >
                        Distance
                      </button>
                    )}
                  {category.categoryRequirement === "OPTIONAL" &&
                    category.aggregateStatus !== "PAID" &&
                    category.totalPaid === 0 && (
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={async () => {
                          try {
                            await mutations.optOut.mutateAsync(
                              category.studentFeeId,
                            );
                            toast({
                              title: "Optional fee removed",
                              type: "success",
                            });
                          } catch (err) {
                            toast({
                              title: "Opt-out failed",
                              description:
                                err instanceof Error ? err.message : undefined,
                              type: "error",
                            });
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  <button
                    className="text-sm text-red-600 hover:underline disabled:opacity-40"
                    disabled={
                      category.aggregateStatus === "PAID" ||
                      category.aggregateStatus === "WAIVED"
                    }
                    onClick={async () => {
                      try {
                        await mutations.waive.mutateAsync({
                          id: category.studentFeeId,
                          reason: "Waived by admin",
                        });
                        toast({ title: "Fee waived", type: "success" });
                      } catch (err) {
                        toast({
                          title: "Waive failed",
                          description:
                            err instanceof Error ? err.message : undefined,
                          type: "error",
                        });
                      }
                    }}
                  >
                    Waive
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2 pr-3">Period</th>
                      <th className="py-2 pr-3">Due date</th>
                      <th className="py-2 pr-3">Amount</th>
                      <th className="py-2 pr-3">Fine</th>
                      <th className="py-2 pr-3">Paid</th>
                      <th className="py-2 pr-3">Outstanding</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.installments.map((inst) => (
                      <tr key={inst.id} className="border-t">
                        <td className="py-2 pr-3">
                          {inst.label ?? `Installment ${inst.installmentNumber}`}
                        </td>
                        <td className="py-2 pr-3">
                          {inst.dueDate?.slice(0, 10)}
                        </td>
                        <td className="py-2 pr-3">
                          {formatInr(inst.baseAmount - inst.discountAmount)}
                        </td>
                        <td className="py-2 pr-3">
                          {formatInr(inst.fineAmount)}
                        </td>
                        <td className="py-2 pr-3">
                          {formatInr(inst.paidAmount)}
                        </td>
                        <td className="py-2 pr-3">
                          {formatInr(inst.outstandingAmount)}
                        </td>
                        <td className="py-2 pr-3">
                          {FEE_STATUS_LABELS[inst.status] ?? inst.status}
                        </td>
                        <td className="py-2">
                          <button
                            className="text-blue-700 hover:underline disabled:opacity-40"
                            disabled={
                              inst.status === "PAID" || inst.status === "WAIVED"
                            }
                            onClick={() =>
                              setCollectTarget({
                                feeInstallmentId: inst.id,
                                label: `${category.categoryName} · ${
                                  inst.label ??
                                  `Installment ${inst.installmentNumber}`
                                }`,
                                outstandingAmount: inst.outstandingAmount,
                              })
                            }
                          >
                            Collect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))
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
          </Card>
        )}
      </section>

      <CollectPaymentDialog
        open={Boolean(collectTarget)}
        target={collectTarget}
        onClose={() => setCollectTarget(null)}
        onSubmit={async (values) => {
          await mutations.collect.mutateAsync(values);
          toast({ title: "Payment recorded", type: "success" });
        }}
      />

      {transportCategory ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45">
          <div className="w-[90%] max-w-md rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-[#021034]">
              Update transport distance
            </h2>
            <div className="mt-4">
              <label className="text-sm text-slate-600">Distance (km)</label>
              <input
                type="number"
                min={0.01}
                step={0.1}
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                value={transportKm}
                onChange={(e) => setTransportKm(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setTransportCategory(null)}
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={async () => {
                  try {
                    await mutations.updateTransport.mutateAsync({
                      id: transportCategory.studentFeeId,
                      transportDistanceKm: Number(transportKm),
                    });
                    toast({ title: "Transport updated", type: "success" });
                    setTransportCategory(null);
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

      {discountCategory ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45">
          <div className="w-[90%] max-w-md rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-[#021034]">
              Update discount — {discountCategory.categoryName}
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
              <Button variant="ghost" onClick={() => setDiscountCategory(null)}>
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={async () => {
                  try {
                    await mutations.updateDiscount.mutateAsync({
                      id: discountCategory.studentFeeId,
                      payload: {
                        discountAmount: Number(discountAmount),
                        discountReason: discountReason || undefined,
                      },
                    });
                    toast({ title: "Discount updated", type: "success" });
                    setDiscountCategory(null);
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
