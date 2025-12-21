"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";
import { fetchClasses } from "../../lib/adminApi";

export type StudentsFilters = {
  search?: string;
  class?: string;
  status?: string;
};

type Props = {
  initial?: StudentsFilters;
  onApply: (f: StudentsFilters) => void;
  onClear: () => void;
};

export default function StudentsFilterBar({
  initial,
  onApply,
  onClear,
}: Props) {
  const [search, setSearch] = useState(initial?.search ?? "");
  const [klass, setKlass] = useState(initial?.class ?? "");
  const [status, setStatus] = useState(initial?.status ?? "");
  const [classOptions, setClassOptions] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const resp = await fetchClasses({ pageSize: 1000 });
        if (!mounted) return;
        const opts = [
          { id: "", name: "All classes" },
          ...(resp.classes ?? []).map((c) => ({
            id: c.id ?? c.name,
            name: c.section ? `${c.name} - ${c.section}` : c.name,
          })),
        ];
        setClassOptions(opts);
      } catch {
        // ignore — keep default options
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Debounce search and auto-apply — skip initial mount to avoid duplicate calls
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      onApply({ search: search.trim(), class: klass, status });
    }, 500);
    return () => clearTimeout(t);
  }, [search, klass, status, onApply]);

  const handleApply = () =>
    onApply({ search: search.trim(), class: klass, status });
  const handleClear = () => {
    setSearch("");
    setKlass("");
    setStatus("");
    onClear();
  };

  return (
    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="flex-1">
          <label className="sr-only">Search students</label>
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-48">
          <label className="sr-only">Class</label>
          <Select
            options={
              classOptions.length
                ? classOptions
                : [{ id: "", name: "All classes" }]
            }
            value={klass}
            onChange={(v) => setKlass(v)}
            placeholder="All classes"
          />
        </div>

        <div className="w-48">
          <label className="sr-only">Status</label>
          <Select
            options={[
              { id: "", name: "Any status" },
              { id: "active", name: "Active" },
              { id: "inactive", name: "Inactive" },
            ]}
            value={status}
            onChange={(v) => setStatus(v)}
            placeholder="Any status"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
