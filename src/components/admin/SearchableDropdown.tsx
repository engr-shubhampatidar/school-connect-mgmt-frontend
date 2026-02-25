"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  getNotClassTeachers,
  getTeachers,
  Teacher,
} from "@/services/teacher.service";

interface Props {
  value?: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
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
  fetchTeachers,
  subjectId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    setLoading(true);

    const fn = fetchTeachers ?? getNotClassTeachers;
    fn(search, subjectId)
      .then((res) => {
        if (!mounted) return;
        setOptions(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [open, search, subjectId, fetchTeachers]);

  const selected =
    (Array.isArray(options) ? options : []).find((o) => o.id === value) || null;

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center  gap-2 justify-between w-full rounded-md border border-[#D7E3FC]  px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]"
        onClick={() => setOpen((s) => !s)}
      >
        <div>{selected ? selected.name : placeholder}</div>
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
            />
          </div>
          {loading && <div className="p-2">Loading...</div>}
          {!loading &&
            options.map((opt) => (
              <div
                key={opt.id}
                className="p-2 hover:bg-slate-50 cursor-pointer"
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
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
