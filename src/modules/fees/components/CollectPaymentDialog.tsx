"use client";

import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { PaymentMethod } from "@/modules/fees/types";
import { formatInr } from "@/modules/fees/utils/format";

type CollectTarget = {
  feeInstallmentId: string;
  label: string;
  outstandingAmount: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  target: CollectTarget | null;
  onSubmit: (values: {
    feeInstallmentId: string;
    amount: number;
    method: PaymentMethod;
    referenceNumber?: string;
    notes?: string;
  }) => Promise<void>;
};

export const CollectPaymentDialog: FC<Props> = ({
  open,
  onClose,
  target,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !target) return;

    setAmount(String(target.outstandingAmount ?? 0));
    setMethod("CASH");
    setReferenceNumber("");
    setNotes("");
    setError(null);
    setLoading(false);
  }, [open, target]);

  const handleSubmit = async () => {
    if (!target) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        feeInstallmentId: target.feeInstallmentId,
        amount: Number(amount),
        method,
        referenceNumber: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to collect payment",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[777px] max-h-full overflow-hidden overflow-y-auto p-4 no-scrollbar">
          <div className="rounded-lg">
            <div className="min-h-full">
              {/* Header */}
              <div className="sticky top-0 flex items-start justify-between gap-4 rounded-t-lg bg-[#021034] px-[16px] py-[24px]">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Collect Payment
                  </h3>

                  <p className="text-[14px] font-[400] text-white">
                    Record a payment against the selected fee installment.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="close"
                  onClick={onClose}
                  disabled={loading}
                  className="text-white hover:text-white/80 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="max-h-full overflow-hidden rounded-b-lg bg-white p-[16px]">
                <Card>
                  <h1 className="mb-[24px] text-[16px] font-[600] text-[#0F172A]">
                    Payment Information
                  </h1>

                  <div className="flex flex-col gap-5">
                    {/* Payment Target */}
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-[#0F172A]">
                        {target.label}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Outstanding Amount:{" "}
                        <span className="font-semibold text-[#021034]">
                          {formatInr(target.outstandingAmount)}
                        </span>
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <h2 className="mb-4 text-[16px] font-[600] text-[#0F172A]">
                        Payment Details
                      </h2>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Amount */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Amount
                          </label>

                          <input
                            type="number"
                            min={0.01}
                            step="0.01"
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>

                        {/* Method */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Payment Method
                          </label>

                          <select
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={method}
                            onChange={(e) =>
                              setMethod(e.target.value as PaymentMethod)
                            }
                          >
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CHEQUE">Cheque</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="CARD">Card</option>
                          </select>
                        </div>

                        {/* Reference */}
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-[#0F172A]">
                            Reference Number
                            <span className="ml-1 font-normal text-slate-400">
                              (Optional)
                            </span>
                          </label>

                          <input
                            type="text"
                            placeholder="Enter transaction / cheque reference"
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                          />
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-[#0F172A]">
                            Notes
                            <span className="ml-1 font-normal text-slate-400">
                              (Optional)
                            </span>
                          </label>

                          <textarea
                            rows={3}
                            placeholder="Add any additional payment notes"
                            className="mt-1 w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Error */}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>
                </Card>

                {/* Footer */}
                <div className="sticky bottom-0 mt-6 flex justify-end gap-2 bg-white">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="dark"
                    disabled={loading || !amount || Number(amount) <= 0}
                    onClick={() => void handleSubmit()}
                  >
                    {loading ? "Collecting..." : "Collect Payment"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
