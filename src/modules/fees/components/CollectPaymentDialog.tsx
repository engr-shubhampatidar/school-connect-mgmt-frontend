"use client";

import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { PaymentMethod, StudentFee } from "@/modules/fees/types";
import { formatInr } from "@/modules/fees/utils/format";

type Props = {
  open: boolean;
  onClose: () => void;
  studentFee: StudentFee | null;
  onSubmit: (values: {
    studentFeeId: string;
    amount: number;
    method: PaymentMethod;
    referenceNumber?: string;
    notes?: string;
  }) => Promise<void>;
};

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

export const CollectPaymentDialog: FC<Props> = ({
  open,
  onClose,
  studentFee,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !studentFee) return;
    setAmount(String(studentFee.outstandingAmount ?? 0));
    setMethod("CASH");
    setReferenceNumber("");
    setNotes("");
    setError(null);
    setLoading(false);
  }, [open, studentFee]);

  if (!open || !studentFee) return null;

  return (
    <div style={backdrop} onClick={onClose}>
      <div
        className="w-[90%] max-w-lg rounded-md bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#021034]">Collect payment</h2>
        <p className="mt-1 text-sm text-slate-500">
          {studentFee.studentName ?? "Student"} ·{" "}
          {studentFee.feeStructureName ?? "Fee"} · Outstanding{" "}
          {formatInr(studentFee.outstandingAmount)}
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-slate-600">Amount</label>
            <input
              type="number"
              min={0.01}
              step="0.01"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Method</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option value="CARD">Card</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Reference</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Notes</label>
            <textarea
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="dark"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await onSubmit({
                  studentFeeId: studentFee.id,
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
            }}
          >
            {loading ? "Collecting..." : "Collect"}
          </Button>
        </div>
      </div>
    </div>
  );
};
