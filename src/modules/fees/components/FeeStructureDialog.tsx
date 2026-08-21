"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { FeeCategory, FeeStructure } from "@/modules/fees/types";
import { fetchClasses, type ClassItem } from "@/modules/classes";

type PlanItemForm = {
  categoryId: string;
  amount: string;
  slab10: string;
  slab20: string;
  slab30: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  categories: FeeCategory[];
  initial?: FeeStructure | null;
};

type TransportSlabKey = "slab10" | "slab20" | "slab30";

const TRANSPORT_THRESHOLDS = [10, 20, 30] as const;

function emptyItem(): PlanItemForm {
  return {
    categoryId: "",
    amount: "0",
    slab10: "",
    slab20: "",
    slab30: "",
  };
}

export const FeeStructureDialog: FC<Props> = ({
  open,
  onClose,
  onSubmit,
  categories,
  initial,
}) => {
  const [classId, setClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [itemForms, setItemForms] = useState<Record<string, PlanItemForm>>({});
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive),
    [categories],
  );

  useEffect(() => {
    if (!open) return;

    setClassId(initial?.classId ?? "");
    setAcademicYear(initial?.academicYear ?? "");
    setName(initial?.name ?? "");
    setIsActive(initial?.isActive ?? true);
    setError(null);
    setLoading(false);

    const ids = initial?.items?.map((i) => i.categoryId) ?? [];
    setSelectedCategoryIds(ids);

    const forms: Record<string, PlanItemForm> = {};

    for (const item of initial?.items ?? []) {
      const slab10 = item.transportSlabs?.find((s) => s.thresholdKm === 10);
      const slab20 = item.transportSlabs?.find((s) => s.thresholdKm === 20);
      const slab30 = item.transportSlabs?.find((s) => s.thresholdKm === 30);

      forms[item.categoryId] = {
        categoryId: item.categoryId,
        amount: String(item.amount),
        slab10: slab10 ? String(slab10.amount) : "",
        slab20: slab20 ? String(slab20.amount) : "",
        slab30: slab30 ? String(slab30.amount) : "",
      };
    }

    setItemForms(forms);

    void fetchClasses({ page: 1, pageSize: 100 })
      .then((res) => setClasses(res.classes ?? []))
      .catch(() => setClasses([]));
  }, [open, initial]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }

      setItemForms((forms) => ({
        ...forms,
        [categoryId]: forms[categoryId] ?? {
          ...emptyItem(),
          categoryId,
        },
      }));

      return [...prev, categoryId];
    });
  };

  const updateItemField = (
    categoryId: string,
    field: keyof PlanItemForm,
    value: string,
  ) => {
    setItemForms((prev) => {
      const current = prev[categoryId] ?? {
        ...emptyItem(),
        categoryId,
      };

      return {
        ...prev,
        [categoryId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const buildPayload = () => {
    const items = selectedCategoryIds.map((categoryId) => {
      const cat = activeCategories.find((c) => c.id === categoryId);
      const form = itemForms[categoryId] ?? emptyItem();

      const item: Record<string, unknown> = {
        categoryId,
        amount: Number(form.amount) || 0,
      };

      if (cat?.type === "TRANSPORT") {
        const slabs: Array<{
          thresholdKm: number;
          amount: number;
        }> = [];

        if (form.slab10) {
          slabs.push({
            thresholdKm: 10,
            amount: Number(form.slab10),
          });
        }

        if (form.slab20) {
          slabs.push({
            thresholdKm: 20,
            amount: Number(form.slab20),
          });
        }

        if (form.slab30) {
          slabs.push({
            thresholdKm: 30,
            amount: Number(form.slab30),
          });
        }

        if (slabs.length) {
          item.transportSlabs = slabs;
        }
      }

      return item;
    });

    return {
      classId,
      academicYear: academicYear.trim(),
      name: name.trim() || undefined,
      isActive,
      items,
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await onSubmit(buildPayload());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

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
                    {initial ? "Edit Fee Plan" : "Create New Fee Plan"}
                  </h3>

                  <p className="text-[14px] font-[400] text-white">
                    Configure annual fee categories and pricing for a class.
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
                    Fee Plan Information
                  </h1>

                  <div className="flex flex-col gap-5">
                    {/* Basic Information */}
                    <div>
                      <h2 className="mb-4 text-[16px] font-[600] text-[#0F172A]">
                        Basic Information
                      </h2>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Class */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Class
                          </label>

                          <select
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={classId}
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

                        {/* Academic Year */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Academic Year
                          </label>

                          <input
                            type="text"
                            placeholder="2025-26"
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                          />
                        </div>

                        {/* Plan Name */}
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-[#0F172A]">
                            Plan Name
                            <span className="ml-1 font-normal text-slate-400">
                              (Optional)
                            </span>
                          </label>

                          <input
                            type="text"
                            placeholder="e.g. Standard Fee Plan"
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h2 className="mb-1 text-[16px] font-[600] text-[#0F172A]">
                        Categories & Pricing
                      </h2>

                      <p className="mb-4 text-sm text-slate-500">
                        Select the fee categories and configure their annual
                        amounts.
                      </p>

                      <div className="flex flex-col gap-3">
                        {activeCategories.map((cat) => {
                          const selected = selectedCategoryIds.includes(cat.id);

                          const form = itemForms[cat.id] ?? {
                            ...emptyItem(),
                            categoryId: cat.id,
                          };

                          return (
                            <div
                              key={cat.id}
                              className="rounded-md border border-slate-200 p-4"
                            >
                              {/* Category Header */}
                              <div className="flex items-center">
                                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0F172A]">
                                  <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => toggleCategory(cat.id)}
                                    className="h-4 w-4"
                                  />

                                  <span>{cat.name}</span>

                                  <span
                                    className={`rounded px-1.5 py-0.5 text-xs ${
                                      cat.requirement === "MANDATORY"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-amber-50 text-amber-700"
                                    }`}
                                  >
                                    {cat.requirement}
                                  </span>

                                  {cat.type === "TRANSPORT" && (
                                    <span className="rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-700">
                                      Transport
                                    </span>
                                  )}
                                </label>
                              </div>

                              {/* Pricing Fields */}
                              {selected && (
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                  <div
                                    className={`grid grid-cols-1 gap-4 ${
                                      cat.type === "TRANSPORT"
                                        ? "sm:grid-cols-2"
                                        : "sm:grid-cols-2"
                                    }`}
                                  >
                                    {/* Base Amount */}
                                    <div>
                                      <label className="text-sm font-medium text-[#0F172A]">
                                        {cat.type === "TRANSPORT"
                                          ? "Annual Price ≤10 km"
                                          : "Annual Amount"}
                                      </label>

                                      <input
                                        type="number"
                                        min={0}
                                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                                        value={form.amount}
                                        onChange={(e) =>
                                          updateItemField(
                                            cat.id,
                                            "amount",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Transport Slabs */}
                                    {cat.type === "TRANSPORT" &&
                                      TRANSPORT_THRESHOLDS.map((threshold) => {
                                        const key: TransportSlabKey =
                                          threshold === 10
                                            ? "slab10"
                                            : threshold === 20
                                              ? "slab20"
                                              : "slab30";

                                        return (
                                          <div key={threshold}>
                                            <label className="text-sm font-medium text-[#0F172A]">
                                              Price &gt;{threshold} km
                                            </label>

                                            <input
                                              type="number"
                                              min={0}
                                              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                                              value={form[key]}
                                              onChange={(e) =>
                                                updateItemField(
                                                  cat.id,
                                                  key,
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {activeCategories.length === 0 && (
                          <div className="rounded-md border border-dashed border-slate-200 px-4 py-8 text-center">
                            <p className="text-sm text-slate-500">
                              No active fee categories available.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active */}
                    <div className="border-t border-slate-100 pt-4">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0F172A]">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="h-4 w-4"
                        />

                        <span>Active</span>
                      </label>
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
                      loading ||
                      !classId ||
                      !academicYear.trim() ||
                      selectedCategoryIds.length === 0
                    }
                    onClick={handleSubmit}
                  >
                    {loading
                      ? "Saving..."
                      : initial
                        ? "Update Plan"
                        : "Create Plan"}
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
