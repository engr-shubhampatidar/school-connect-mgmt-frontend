"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";

export type TeachersFilters = {
  search?: string;
  email?: string;
  subject?: string;
};

type Props = {
  initial?: TeachersFilters;
  onApply: (f: TeachersFilters) => void;
  onClear: () => void;
};

export default function TeachersFilterBar({
  initial,
  onApply,
  onClear,
}: Props) {
  const [search, setSearch] = useState(initial?.search ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      onApply({ search: search.trim(), email: email.trim(), subject });
    }, 500);
    return () => clearTimeout(t);
  }, [search, email, subject, onApply]);

  const handleApply = () =>
    onApply({ search: search.trim(), email: email.trim(), subject });
  const handleClear = () => {
    setSearch("");
    setEmail("");
    setSubject("");
    onClear();
  };

  return (
    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="flex-1">
          <label className="sr-only">Search teachers</label>
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-64">
          <label className="sr-only">Email</label>
          <Input
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-48">
          <label className="sr-only">Subject</label>
          <Select
            options={[
              { id: "", name: "All subjects" },
              { id: "Mathematics", name: "Mathematics" },
              { id: "Science", name: "Science" },
              { id: "English", name: "English" },
            ]}
            value={subject}
            onChange={(v) => setSubject(v)}
            placeholder="All subjects"
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
