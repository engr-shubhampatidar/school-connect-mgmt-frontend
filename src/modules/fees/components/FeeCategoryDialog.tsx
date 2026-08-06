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
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
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
