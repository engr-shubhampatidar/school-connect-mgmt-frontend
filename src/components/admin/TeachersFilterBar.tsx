"use client";
import { useEffect, useRef, useState } from "react";
import API from "../../lib/axios";
import { ADMIN_API } from "../../lib/api-routes";
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
      const s = search.trim() || email.trim();
      onApply({ search: s, email: email.trim(), subject });
    }, 500);
    return () => clearTimeout(t);
  }, [search, email, subject, onApply]);

  const [subjectOptions, setSubjectOptions] = useState<{
    id: string;
    name: string;
  }[]>([{ id: "", name: "All subjects" }]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await API.get(ADMIN_API.SUBJECTS);
        const raw = res.data as unknown;
        const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
        const items = Array.isArray(obj.subjects)
          ? obj.subjects
          : Array.isArray(obj.items)
          ? obj.items
          : Array.isArray(raw)
          ? (raw as unknown[])
          : [];

        const opts = (items || [])
          .map((it) => {
            if (!it) return null;
            if (typeof it === "string") return { id: it, name: it };
            if (typeof it === "object") {
              const o = it as Record<string, unknown>;
              const id = (o.id ?? o._id ?? o.name ?? "") as string;
              const name = (o.name ?? o.subjectName ?? id) as string;
              return { id, name };
            }
            return null;
          })
          .filter(Boolean) as { id: string; name: string }[];

        if (mounted && opts.length > 0) {
          setSubjectOptions([{ id: "", name: "All subjects" }, ...opts]);
        }
      } catch (e) {
        // keep default options on error
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleApply = () => {
    const s = search.trim() || email.trim();
    onApply({ search: s, email: email.trim(), subject });
  };
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
            options={subjectOptions}
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
