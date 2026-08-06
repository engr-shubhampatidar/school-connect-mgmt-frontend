"use client";

import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { FeeCategory, FeeStructure, FineType } from "@/modules/fees/types";
import { fetchClasses, type ClassItem } from "@/modules/classes";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  categories: FeeCategory[];
  initial?: FeeStructure | null;
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

export const FeeStructureDialog: FC<Props> = ({
  open,
  onClose,
  onSubmit,
  categories,
  initial,
}) => {
  const [name, setName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [classId, setClassId] = useState("");
  const [amount, setAmount] = useState("0");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState("ONE_TIME");
  const [fineType, setFineType] = useState<FineType>("NONE");
  const [fineAmount, setFineAmount] = useState("");
  const [fineRate, setFineRate] = useState("");
  const [fineCap, setFineCap] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setAcademicYear(initial?.academicYear ?? "");
    setCategoryId(initial?.categoryId ?? "");
    setClassId(initial?.classId ?? "");
    setAmount(String(initial?.amount ?? 0));
    setDueDate(initial?.dueDate?.slice(0, 10) ?? "");
    setFrequency(initial?.frequency ?? "ONE_TIME");
    setFineType(initial?.fineType ?? "NONE");
    setFineAmount(
      initial?.fineAmount != null ? String(initial.fineAmount) : "",
    );
    setFineRate(initial?.fineRate != null ? String(initial.fineRate) : "");
    setFineCap(initial?.fineCap != null ? String(initial.fineCap) : "");
    setIsActive(initial?.isActive ?? true);
    setError(null);
    setLoading(false);

    void fetchClasses({ page: 1, pageSize: 100 })
      .then((res) => setClasses(res.classes ?? []))
      .catch(() => setClasses([]));
  }, [open, initial]);

  if (!open) return null;

  return (
    <div style={backdrop} onClick={onClose}>
      <div
        className="w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-md bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#021034]">
          {initial ? "Edit fee structure" : "Add fee structure"}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-600">Name</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Academic year</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              placeholder="2025-26"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Category</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Class (optional)</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
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
          </div>
          <div>
            <label className="text-sm text-slate-600">Amount (INR)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Due date</label>
            <input
              type="date"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Frequency</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="ONE_TIME">One time</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Fine type</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={fineType}
              onChange={(e) => setFineType(e.target.value as FineType)}
            >
              <option value="NONE">None</option>
              <option value="DAILY_FIXED">Daily fixed</option>
              <option value="ONE_TIME_FIXED">One-time fixed</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>
          {(fineType === "DAILY_FIXED" || fineType === "ONE_TIME_FIXED") && (
            <div>
              <label className="text-sm text-slate-600">Fine amount</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
              />
            </div>
          )}
          {fineType === "PERCENTAGE" && (
            <div>
              <label className="text-sm text-slate-600">Fine rate (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.01"
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                value={fineRate}
                onChange={(e) => setFineRate(e.target.value)}
              />
            </div>
          )}
          {fineType !== "NONE" && (
            <div>
              <label className="text-sm text-slate-600">
                Fine cap (optional)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                value={fineCap}
                onChange={(e) => setFineCap(e.target.value)}
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
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
                  name: name.trim(),
                  academicYear: academicYear.trim(),
                  categoryId,
                  classId: classId || undefined,
                  amount: Number(amount),
                  dueDate,
                  frequency,
                  fineType,
                  fineAmount: fineAmount ? Number(fineAmount) : undefined,
                  fineRate: fineRate ? Number(fineRate) : undefined,
                  fineCap: fineCap ? Number(fineCap) : undefined,
                  isActive,
                });
                onClose();
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Failed to save structure",
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
