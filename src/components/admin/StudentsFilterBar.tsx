"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import type { ClassItem } from "../../lib/adminApi";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";

export type StudentsFilters = {
  search?: string;
  classId?: string;
  status?: string;
};

type Props = {
  initial?: StudentsFilters;
  onApply: (f: StudentsFilters) => void;
  onClear: () => void;
  classes?: ClassItem[];
};

export default function StudentsFilterBar({
  initial,
  onApply,
  onClear,
  classes: parentClasses,
}: Props) {
  const [search, setSearch] = useState(initial?.search ?? "");
  const [klass, setKlass] = useState(initial?.classId ?? "");
  const [status, setStatus] = useState(initial?.status ?? "");

  const classOptions = useMemo(() => {
    if (parentClasses && parentClasses.length > 0) {
      return [
        { id: "", name: "All classes" },
        ...parentClasses.map((c) => ({
          id: c.id ?? c.name,
          name: c.section ? `${c.name} - ${c.section}` : c.name,
        })),
      ];
    }
    return [{ id: "", name: "All classes" }];
  }, [parentClasses]);

  // Debounce search and auto-apply — skip initial mount to avoid duplicate calls
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      onApply({ search: search.trim(), classId: klass, status });
    }, 500);
    return () => clearTimeout(t);
  }, [search, klass, status, onApply]);

  const handleApply = () =>
    onApply({ search: search.trim(), classId: klass, status });

  const handleClear = () => {
    setSearch("");
    setKlass("");
    setStatus("");
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
