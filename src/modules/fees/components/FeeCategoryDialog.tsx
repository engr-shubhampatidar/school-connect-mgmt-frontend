"use client";

import React, { FC, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { FeeCategory } from "@/modules/fees/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    description?: string;
    requirement: "MANDATORY" | "OPTIONAL";
    type: "STANDARD" | "TRANSPORT";
    isActive: boolean;
  }) => Promise<void>;
  initial?: FeeCategory | null;
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

export const FeeCategoryDialog: FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initial,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState<"MANDATORY" | "OPTIONAL">(
    "MANDATORY",
  );
  const [type, setType] = useState<"STANDARD" | "TRANSPORT">("STANDARD");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setRequirement(initial?.requirement ?? "MANDATORY");
    setType(initial?.type ?? "STANDARD");
    setIsActive(initial?.isActive ?? true);
    setError(null);
    setLoading(false);
  }, [open, initial]);

  if (!open) return null;

  return (
    <div style={backdrop} onClick={onClose}>
      <div
        className="w-[90%] max-w-lg rounded-md bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#021034]">
          {initial ? "Edit category" : "Add category"}
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Description</label>
            <textarea
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Category type</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "STANDARD" | "TRANSPORT")
              }
            >
              <option value="STANDARD">Standard</option>
              <option value="TRANSPORT">Transport</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Fee requirement
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                  requirement === "MANDATORY"
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="requirement"
                  checked={requirement === "MANDATORY"}
                  onChange={() => setRequirement("MANDATORY")}
                />
                Mandatory
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                  requirement === "OPTIONAL"
                    ? "border-amber-600 bg-amber-50 text-amber-800"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="requirement"
                  checked={requirement === "OPTIONAL"}
                  onChange={() => setRequirement("OPTIONAL")}
                />
                Optional
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="dark"
            disabled={loading || !name.trim()}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await onSubmit({
                  name: name.trim(),
                  description: description.trim() || undefined,
                  requirement,
                  type,
                  isActive,
                });
                onClose();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Failed to save category",
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
