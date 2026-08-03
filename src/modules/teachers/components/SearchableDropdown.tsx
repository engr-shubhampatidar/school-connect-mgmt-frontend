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
  /** Which teacher id to emit/match. Create class uses user_id; update class uses profile id. */
  idKey?: "user_id" | "id";
  fetchTeachers?: (
    search: string,
    subjectId?: string | null,
  ) => Promise<Teacher[]>;
}

function teacherSelectId(
  t: Teacher,
  idKey: "user_id" | "id",
): string | null {
  if (idKey === "id") return t.id || null;
  return t.user_id || null;
}

function teacherLabel(t: Teacher): string {
  const specialty = (t.subjects ?? []).filter(Boolean).join(", ");
  return specialty ? `${t.name} — ${specialty}` : t.name;
}

export default function SearchableDropdown({
  value,
  onChange,
  placeholder = "Select...",
  selectedLabel,
  fetchTeachers,
  subjectId,
  idKey = "user_id",
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
    setFetched(false);
    setOptions([]);
  }, [subjectId]);

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
          const id = match ? teacherSelectId(match, idKey) : null;
          if (id) onChange(id);
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
  }, [open, fetched, subjectId, value, selectedLabel, onChange, idKey]);

  const selected =
    options.find((o) => teacherSelectId(o, idKey) === value) ?? null;
  const displayName = selected
    ? teacherLabel(selected)
    : (selectedLabel ?? placeholder);

  const filtered = options.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return teacherLabel(o).toLowerCase().includes(q);
  });

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 justify-between w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-[14px] text-[#64748B] font-[400] placeholder:text-[#6B7280] cursor-pointer"
        onClick={() => {
          if (open) setSearch("");
          setOpen((s) => !s);
        }}
      >
        <div className="truncate">{displayName}</div>
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
            filtered.map((opt) => {
              const id = teacherSelectId(opt, idKey);
              return (
                <div
                  key={opt.id || id || opt.name}
                  className="p-2 hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {teacherLabel(opt)}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
