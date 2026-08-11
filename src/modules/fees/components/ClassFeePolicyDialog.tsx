"use client";

import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { FeeClassPolicy, FineType } from "@/modules/fees/types";
import { fetchClasses, type ClassItem } from "@/modules/classes";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  initial?: FeeClassPolicy | null;
  presetClassId?: string;
  presetAcademicYear?: string;
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

export const ClassFeePolicyDialog: FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initial,
  presetClassId,
  presetAcademicYear,
}) => {
  const [classId, setClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [frequency, setFrequency] = useState("ONE_TIME");
  const [fineType, setFineType] = useState<FineType>("NONE");
  const [fineAmount, setFineAmount] = useState("");
  const [fineRate, setFineRate] = useState("");
  const [fineCap, setFineCap] = useState("");
  const [startDate, setStartDate] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setClassId(initial?.classId ?? presetClassId ?? "");
    setAcademicYear(initial?.academicYear ?? presetAcademicYear ?? "");
    setFrequency(initial?.frequency ?? "ONE_TIME");
    setFineType(initial?.fineType ?? "NONE");
    setFineAmount(
      initial?.fineAmount != null ? String(initial.fineAmount) : "",
    );
    setFineRate(initial?.fineRate != null ? String(initial.fineRate) : "");
    setFineCap(initial?.fineCap != null ? String(initial.fineCap) : "");
    setStartDate(initial?.startDate?.slice(0, 10) ?? "");
    setError(null);
    setLoading(false);

    void fetchClasses({ page: 1, pageSize: 100 })
      .then((res) => setClasses(res.classes ?? []))
      .catch(() => setClasses([]));
  }, [open, initial, presetClassId, presetAcademicYear]);

  if (!open) return null;

  return (
    <div style={backdrop} onClick={onClose}>
      <div
        className="w-[95%] max-w-lg rounded-md bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#021034]">
          {initial ? "Edit class fee policy" : "Add class fee policy"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Payment frequency, installment start date, and fine rules applied per
          student when fees are assigned.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600">Class</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              value={classId}
              disabled={!!initial}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.section ? `-${c.section}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Academic year</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              placeholder="2025-26"
              value={academicYear}
              disabled={!!initial}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Installment start date</label>
            <input
              type="date"
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Payment frequency</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="ONE_TIME">One time</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="HALF_YEARLY">Half-yearly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Penalty type</label>
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
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                value={fineRate}
                onChange={(e) => setFineRate(e.target.value)}
              />
            </div>
          )}
          {fineType !== "NONE" && (
            <div>
              <label className="text-sm text-slate-600">Fine cap (optional)</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                value={fineCap}
                onChange={(e) => setFineCap(e.target.value)}
              />
            </div>
          )}
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="dark"
            disabled={
              loading || !classId || !academicYear.trim() || !startDate
            }
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await onSubmit({
                  classId,
                  academicYear: academicYear.trim(),
                  frequency,
                  fineType,
                  fineAmount: fineAmount ? Number(fineAmount) : null,
                  fineRate: fineRate ? Number(fineRate) : null,
                  fineCap: fineCap ? Number(fineCap) : null,
                  startDate,
                });
                onClose();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Failed to save policy",
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
