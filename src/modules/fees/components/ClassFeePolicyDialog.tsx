"use client";

import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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

  const handleSubmit = async () => {
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
      setError(err instanceof Error ? err.message : "Failed to save policy");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex items-start justify-between gap-4 rounded-t-lg bg-[#021034] px-[16px] py-[24px] sticky top-0">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    {initial ? "Edit Class Fee Policy" : "Add Class Fee Policy"}
                  </h3>

                  <p className="text-[14px] font-[400] text-white">
                    Configure payment frequency, installment dates, and fine
                    rules for the selected class.
                  </p>
                </div>

                <div>
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
              </div>

              {/* Content */}
              <div className="max-h-full overflow-hidden rounded-b-lg bg-white p-[16px]">
                <Card>
                  <h1 className="mb-[24px] text-[16px] font-[600] text-[#0F172A]">
                    Fee Policy Information
                  </h1>

                  <div className="flex flex-col gap-5">
                    {/* Class & Academic Year */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-[#0F172A]">
                          Class
                        </label>

                        <select
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034] disabled:bg-slate-50"
                          value={classId}
                          disabled={!!initial}
                          onChange={(e) => setClassId(e.target.value)}
                        >
                          <option value="">Select class</option>

                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                              {c.section ? `-${c.section}` : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[#0F172A]">
                          Academic Year
                        </label>

                        <input
                          type="text"
                          placeholder="2025-26"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034] disabled:bg-slate-50"
                          value={academicYear}
                          disabled={!!initial}
                          onChange={(e) => setAcademicYear(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Start Date & Frequency */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-[#0F172A]">
                          Installment Start Date
                        </label>

                        <input
                          type="date"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[#0F172A]">
                          Payment Frequency
                        </label>

                        <select
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
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
                    </div>

                    {/* Fine Section */}
                    <div>
                      <h2 className="mb-4 text-[16px] font-[600] text-[#0F172A]">
                        Fine Configuration
                      </h2>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Fine Type */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Penalty Type
                          </label>

                          <select
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={fineType}
                            onChange={(e) =>
                              setFineType(e.target.value as FineType)
                            }
                          >
                            <option value="NONE">None</option>
                            <option value="DAILY_FIXED">Daily fixed</option>
                            <option value="ONE_TIME_FIXED">
                              One-time fixed
                            </option>
                            <option value="PERCENTAGE">Percentage</option>
                          </select>
                        </div>

                        {/* Fine Amount */}
                        {(fineType === "DAILY_FIXED" ||
                          fineType === "ONE_TIME_FIXED") && (
                          <div>
                            <label className="text-sm font-medium text-[#0F172A]">
                              Fine Amount
                            </label>

                            <input
                              type="number"
                              min={0}
                              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                              value={fineAmount}
                              onChange={(e) => setFineAmount(e.target.value)}
                            />
                          </div>
                        )}

                        {/* Fine Rate */}
                        {fineType === "PERCENTAGE" && (
                          <div>
                            <label className="text-sm font-medium text-[#0F172A]">
                              Fine Rate (%)
                            </label>

                            <input
                              type="number"
                              min={0}
                              max={100}
                              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                              value={fineRate}
                              onChange={(e) => setFineRate(e.target.value)}
                            />
                          </div>
                        )}

                        {/* Fine Cap */}
                        {fineType !== "NONE" && (
                          <div>
                            <label className="text-sm font-medium text-[#0F172A]">
                              Fine Cap
                              <span className="ml-1 font-normal text-slate-400">
                                (Optional)
                              </span>
                            </label>

                            <input
                              type="number"
                              min={0}
                              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                              value={fineCap}
                              onChange={(e) => setFineCap(e.target.value)}
                            />
                          </div>
                        )}
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
                    disabled={
                      loading || !classId || !academicYear.trim() || !startDate
                    }
                    onClick={handleSubmit}
                  >
                    {loading
                      ? "Saving..."
                      : initial
                        ? "Update Policy"
                        : "Save Policy"}
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
