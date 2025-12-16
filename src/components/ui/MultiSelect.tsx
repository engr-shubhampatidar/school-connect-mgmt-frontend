"use client";
import React, { useEffect, useRef, useState } from "react";

type Option = { id: string; name: string };

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select subjects",
  className = "",
}: {
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm"
      >
        <div className="flex flex-wrap gap-2">
          {value.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            value
              .map((id) => options.find((o) => o.id === id)?.name ?? id)
              .map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                >
                  {label}
                </span>
              ))
          )}
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-100 bg-white shadow-sm">
          <div className="max-h-48 overflow-auto p-2">
            {options.map((o) => (
              <label
                key={o.id}
                className="flex items-center gap-2 p-1 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={value.includes(o.id)}
                  onChange={() => toggle(o.id)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{o.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
