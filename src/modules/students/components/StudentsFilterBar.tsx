"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import type { ClassItem } from "@/modules/classes";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";

export type StudentsFilters = {
  search?: string;
  classId?: string;
};

type Props = {
  initial?: StudentsFilters;
  onApply: (f: StudentsFilters) => void;
  onClear?: () => void;
  classes?: ClassItem[];
};

export default function StudentsFilterBar({
  initial,
  onApply,
  classes: parentClasses,
}: Props) {
  const [search, setSearch] = useState(initial?.search ?? "");
  const [klass, setKlass] = useState(initial?.classId ?? "");

  const classOptions = useMemo(() => {
    if (parentClasses && parentClasses.length > 0) {
      return [
        { id: "", name: "All classes" },
        ...parentClasses.map((c) => ({
          id: c.id ?? c.name,
          name: c.section ? `${c.name}-${c.section}` : c.name,
        })),
      ];
    }
    return [{ id: "", name: "All classes" }];
  }, [parentClasses]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      onApply({ search: search.trim(), classId: klass || undefined });
    }, 500);
    return () => clearTimeout(t);
  }, [search, klass, onApply]);

  return (
    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="flex-1 w-1/2">
          <div className="lg:w-90 flex-1">
            <label className="sr-only">Search students</label>
            <Input
              className="bg-[#F5F9FF]"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="sr-only">Class</label>
          <Select
            className="bg-[#F5F9FF] min-w-44"
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
      </div>
    </Card>
  );
}
