"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
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

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const TRANSPORT_THRESHOLDS = [10, 20, 30] as const;

function emptyItem(): PlanItemForm {
  return { categoryId: "", amount: "0", slab10: "", slab20: "", slab30: "" };
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
        [categoryId]: forms[categoryId] ?? emptyItem(),
      }));
      return [...prev, categoryId];
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
        const slabs: Array<{ thresholdKm: number; amount: number }> = [];
        if (form.slab10) slabs.push({ thresholdKm: 10, amount: Number(form.slab10) });
        if (form.slab20) slabs.push({ thresholdKm: 20, amount: Number(form.slab20) });
        if (form.slab30) slabs.push({ thresholdKm: 30, amount: Number(form.slab30) });
        if (slabs.length) item.transportSlabs = slabs;
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

  if (!open) return null;

  return (
    <div style={backdrop} onClick={onClose}>
      <div
        className="w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-md bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#021034]">
          {initial ? "Edit fee plan" : "Add fee plan"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Annual category amounts per class and academic year. Set payment
          frequency and fines in the class fee policy.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600">Class</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={classId}
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
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              placeholder="2025-26"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-600">Plan name (optional)</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-medium text-slate-700">Categories & pricing</h3>
          <div className="mt-2 space-y-2">
            {activeCategories.map((cat) => {
              const selected = selectedCategoryIds.includes(cat.id);
              const form = itemForms[cat.id] ?? emptyItem();
              return (
                <div
                  key={cat.id}
                  className="rounded border border-slate-200 p-3"
                >
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    {cat.name}
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
                  {selected && (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <label className="text-xs text-slate-500">
                          {cat.type === "TRANSPORT"
                            ? "Annual price ≤10 km"
                            : "Annual amount"}
                        </label>
                        <input
                          type="number"
                          min={0}
                          className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                          value={form.amount}
                          onChange={(e) =>
                            setItemForms((prev) => ({
                              ...prev,
                              [cat.id]: { ...form, amount: e.target.value },
                            }))
                          }
                        />
                      </div>
                      {cat.type === "TRANSPORT" &&
                        TRANSPORT_THRESHOLDS.map((t) => {
                          const key =
                            t === 10 ? "slab10" : t === 20 ? "slab20" : "slab30";
                          return (
                            <div key={t}>
                              <label className="text-xs text-slate-500">
                                Price &gt;{t} km
                              </label>
                              <input
                                type="number"
                                min={0}
                                className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                                value={form[key]}
                                onChange={(e) =>
                                  setItemForms((prev) => ({
                                    ...prev,
                                    [cat.id]: {
                                      ...form,
                                      [key]: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="dark"
            disabled={
              loading ||
              !classId ||
              !academicYear.trim() ||
              selectedCategoryIds.length === 0
            }
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await onSubmit(buildPayload());
                onClose();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Failed to save plan",
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
