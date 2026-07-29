"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  searchSubjects,
  createSubjectOption,
  type SubjectOption,
} from "@/modules/subjects/api/subjects";
import { Button } from "@/components/ui";
import { Search } from "lucide-react";

interface SubjectMultiSelectProps {
  value: SubjectOption[];
  onChange: (subjects: SubjectOption[]) => void;
  placeholder?: string;
}

export default function SubjectMultiSelect({
  value,
  onChange,
  placeholder = "Search subjects...",
}: SubjectMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SubjectOption[]>([]);
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
    searchSubjects(search || "")
      .then((res) => {
        if (!mounted) return;
        setOptions(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [open, search]);

  const selectedIds = useMemo(() => new Set(value.map((s) => s.id)), [value]);

  function toggleSelect(s: SubjectOption) {
    if (selectedIds.has(s.id)) {
      onChange(value.filter((v) => v.id !== s.id));
    } else {
      onChange([...value, s]);
    }
  }

  async function handleCreate() {
    const name = search.trim();
    if (!name) return;
    setLoading(true);
    try {
      const created = await createSubjectOption({ name });
      onChange([...value, created]);
      setSearch("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={ref} className="">
      <div className="flex items-center  gap-2 justify-between w-full rounded-md border border-[#D7E3FC]  px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280]">
        <Search className="mr-2 inline size-4 text-slate-400" />
        {value.map((s) => (
          <div
            key={s.id}
            className="rounded-[8px] h-[26px] bg-[#F5F9FF] border border-[#D7E3FC] px-2 py-0.5 text-xs text-[#64748B] flex items-center gap-1"
          >
            <span>{s.name}</span>
            <button
              aria-label={`remove-${s.id}`}
              onClick={() => onChange(value.filter((v) => v.id !== s.id))}
            >
              ✕
            </button>
          </div>
        ))}
        <div className="flex-1">
          <input
            className="outline-none"
            placeholder={placeholder}
            value={search}
            onFocus={() => setOpen(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {open && (
        <>
          <div className="  mt-2 w-full bg-white border rounded shadow max-h-60 overflow-auto">
            {loading && <div className="p-3">Loading...</div>}
            {!loading && options.length === 0 && (
              <div className="p-3 flex items-center justify-between">
                <div>No results</div>
                <Button size="sm" onClick={handleCreate}>
                  Create &quot;{search}&quot;
                </Button>
              </div>
            )}
            {!loading &&
              Array.isArray(options) &&
              options.map((opt) => (
                <div
                  key={opt.id}
                  className="p-2 hover:bg-slate-50 cursor-pointer flex justify-between"
                  onClick={() => toggleSelect(opt)}
                >
                  <div>{opt.name}</div>
                  <div>{selectedIds.has(opt.id) ? "✓" : ""}</div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
