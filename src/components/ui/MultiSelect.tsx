"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

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
        className="w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-left text-sm flex items-center gap-2"
      >
        <Search className="mr-2 inline size-4 text-slate-400" />
        <div className="flex flex-wrap gap-2">
          {value.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            value.map((id) => {
              const label = options.find((o) => o.id === id)?.name ?? id;

              return (
                <p
                  key={id}
                  className="rounded-[8px] h-[26px] bg-[#F5F9FF] border border-[#D7E3FC] px-2 py-0.5 text-xs text-[#64748B] flex items-center gap-1"
                >
                  {label}
                  <X
                    className="inline h-4 w-4 text-[#64748B] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(value.filter((v) => v !== id));
                    }}
                  />
                </p>
              );
            })
          )}
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#D7E3FC] bg-white shadow-sm">
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
                  // disabled={!value.includes(o.id) && value.length >= 5}
                  className="h-4 w-4"
                />
                <span className="text-sm">{o.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {value.length > 5 && (
        <p className="text-sm text-red-600">You can select up to 5 subjects</p>
      )}
    </div>
  );
}
