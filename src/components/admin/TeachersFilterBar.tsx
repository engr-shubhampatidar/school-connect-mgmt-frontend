"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";

// Filters shape used by the teachers list
export type TeachersFilters = {
  // general search (name or fallback to email)
  search?: string;
  // filter by teacher email
  email?: string;
  // filter by subject id/name
  subject?: string;
};

// Component props
type Props = {
  // initial values to populate the filter inputs
  initial?: TeachersFilters;
  // called when filters should be applied
  onApply: (f: TeachersFilters) => void;
  // called when filters are cleared
  onClear: () => void;
  // optional subject options provided by parent to avoid duplicated API calls
  subjectOptions?: { id: string; name: string }[];
};

export default function TeachersFilterBar({
  initial,
  onApply,
  onClear,
  subjectOptions,
}: Props) {
  const [search, setSearch] = useState(initial?.search ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");

  // Debounce applying filters when user types.
  // First render is ignored to avoid firing an apply on mount.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      // prefer `search` but fall back to `email` if provided
      const s = search.trim() || email.trim();
      onApply({ search: s, email: email.trim(), subject });
    }, 500);
    return () => clearTimeout(t);
  }, [search, email, subject, onApply]);

  // use subject options from prop if provided, otherwise default to single "All subjects"
  const subjectOpts =
    subjectOptions && subjectOptions.length > 0
      ? [{ id: "", name: "All subjects" }, ...subjectOptions]
      : [{ id: "", name: "All subjects" }];

  // Manual apply/clear handlers used by the Apply/Clear buttons
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
        <div className="flex-1 w-1/2">
          <div className=" lg:w-90 flex-1">
            <label className="sr-only">Search teachers</label>
            <Input
              className="bg-[#F5F9FF]"
              placeholder="Search teacher by name and email"
              value={search || email}
              onChange={(e) => {
                setSearch(e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="w-28 ">
          <label className="sr-only">All Classes</label>
          <Select
            className="bg-[#F5F9FF]"
            options={subjectOpts}
            value={subject}
            onChange={(v) => setSubject(v)}
            placeholder="All Classes"
          />
        </div>
        <div className="w-28">
          <label className="sr-only">Subject</label>
          <Select
            className="bg-[#F5F9FF]"
            options={subjectOpts}
            value={subject}
            onChange={(v) => setSubject(v)}
            placeholder="All subjects"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* <Button onClick={handleApply}>Apply Filters</Button> */}
          <Button variant="ghost" onClick={handleClear}>
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
