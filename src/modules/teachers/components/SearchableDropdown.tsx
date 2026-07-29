"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  getNotClassTeachers,
  type Teacher,
} from "@/modules/teachers/api/teacherService";

interface Props {
  value?: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  selectedLabel?: string | null;
  subjectId?: string | null;
  fetchTeachers?: (
    search: string,
    subjectId?: string | null,
  ) => Promise<Teacher[]>;
}

export default function SearchableDropdown({
  value,
  onChange,
  placeholder = "Select...",
  selectedLabel,
  fetchTeachers,
  subjectId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [fetched, setFetched] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const fetchFnRef = useRef(fetchTeachers ?? getNotClassTeachers);

  useEffect(() => {
    fetchFnRef.current = fetchTeachers ?? getNotClassTeachers;
  }, [fetchTeachers]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!open || fetched) return;

    let mounted = true;
    setLoading(true);

    fetchFnRef
      .current("", subjectId)
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res) ? res : [];
        setOptions(list);
        setFetched(true);
        if (!value && selectedLabel) {
          const match = list.find((t) => t.name === selectedLabel);
          if (match) onChange(match.user_id ?? null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setOptions([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [open, fetched, subjectId, value, selectedLabel, onChange]);

  const selected = options.find((o) => o.user_id === value) ?? null;
  const displayName = selected?.name ?? selectedLabel ?? placeholder;

  const filtered = options.filter(
    (o) => !search || o.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 justify-between w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280] cursor-pointer"
        onClick={() => {
          if (open) setSearch("");
          setOpen((s) => !s);
        }}
      >
        <div>{displayName}</div>
        <div>▾</div>
      </div>
      {open && (
        <div className="absolute z-40 mt-2 w-full bg-white border rounded shadow max-h-60 overflow-auto">
          <div className="p-2">
            <input
              className="w-full border p-1"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {loading && <div className="p-2">Loading...</div>}
          {!loading && filtered.length === 0 && (
            <div className="p-2 text-sm text-slate-500">No teachers found</div>
          )}
          {!loading &&
            filtered.map((opt) => (
              <div
                key={opt.id}
                className="p-2 hover:bg-slate-50 cursor-pointer"
                onClick={() => {
                  onChange(opt.user_id ?? null);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
