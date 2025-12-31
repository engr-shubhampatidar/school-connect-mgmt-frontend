"use client";
import React from "react";
import { Button } from "../../../../../../components/ui/Button";

export default function AttendanceFilters({
  selected,
  onSelect,
  today,
}: {
  selected: string | null;
  onSelect: (d: string | null) => void;
  today: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        aria-label="Select date"
        type="date"
        value={selected ?? today}
        onChange={(e) => onSelect(e.target.value ?? null)}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
      />
      <Button variant="ghost" onClick={() => onSelect(null)}>
        Today
      </Button>
    </div>
  );
}
