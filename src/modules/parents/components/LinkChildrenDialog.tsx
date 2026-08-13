"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/use-toast";
import { fetchStudents } from "@/modules/students/api/adminStudents";
import type { Student } from "@/modules/students/types/admin";
import { PARENT_RELATIONSHIP_OPTIONS } from "@/modules/parents/schemas/parent.schemas";
import { useParentMutations } from "@/modules/parents/hooks/useParents";
import type { ParentRelationship } from "@/modules/parents/types";

type Props = {
  open: boolean;
  parentId: string;
  alreadyLinkedIds?: string[];
  onClose: () => void;
  onLinked?: () => void;
};

type SelectedChild = {
  studentUserId: string;
  name: string;
  relationship: ParentRelationship;
};

export default function LinkChildrenDialog({
  open,
  parentId,
  alreadyLinkedIds = [],
  onClose,
  onLinked,
}: Props) {
  const { toast } = useToast();
  const { link } = useParentMutations();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectedChild[]>([]);
  const [defaultRelationship, setDefaultRelationship] =
    useState<ParentRelationship>("GUARDIAN");

  const linkedSet = useMemo(
    () => new Set(alreadyLinkedIds),
    [alreadyLinkedIds],
  );

  const selectedIds = useMemo(
    () => new Set(selected.map((s) => s.studentUserId)),
    [selected],
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
      setStudents([]);
      setSelected([]);
      setDefaultRelationship("GUARDIAN");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const resp = await fetchStudents({
          search: search.trim() || undefined,
          page: 1,
          pageSize: 20,
        });
        if (!mounted) return;
        setStudents(resp.students ?? []);
      } catch (err) {
        if (!mounted) return;
        toast({
          title: "Failed to load students",
          description: (err as Error)?.message ?? "Unknown error",
          type: "error",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }, 350);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [open, search, toast]);

  const toggleStudent = useCallback(
    (student: Student) => {
      if (linkedSet.has(student.id)) return;
      setSelected((prev) => {
        if (prev.some((s) => s.studentUserId === student.id)) {
          return prev.filter((s) => s.studentUserId !== student.id);
        }
        return [
          ...prev,
          {
            studentUserId: student.id,
            name: student.name,
            relationship: defaultRelationship,
          },
        ];
      });
    },
    [defaultRelationship, linkedSet],
  );

  const updateRelationship = (
    studentUserId: string,
    relationship: ParentRelationship,
  ) => {
    setSelected((prev) =>
      prev.map((s) =>
        s.studentUserId === studentUserId ? { ...s, relationship } : s,
      ),
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast({
        title: "Select at least one child",
        type: "error",
      });
      return;
    }
    try {
      await link.mutateAsync({
        parentId,
        payload: {
          children: selected.map((s) => ({
            studentUserId: s.studentUserId,
            relationship: s.relationship,
          })),
        },
      });
      toast({
        title: "Children linked",
        description: `${selected.length} child(ren) linked successfully.`,
        type: "success",
      });
      onLinked?.();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to link children",
        description: (err as Error)?.message ?? "Unknown error",
        type: "error",
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl p-4 max-h-[90vh] overflow-y-auto">
        <div className="rounded-lg overflow-hidden bg-white">
          <div className="flex items-start bg-[#021034] py-[24px] px-[16px] justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-[700] text-white">
                Link Children
              </h3>
              <p className="text-[14px] font-[400] text-white">
                Search students and link them to this parent.
              </p>
            </div>
            <button
              aria-label="close"
              onClick={onClose}
              className="text-white hover:text-white/80"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  className="bg-[#F5F9FF]"
                  placeholder="Search students by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select
                className="min-w-40 bg-[#F5F9FF]"
                options={[...PARENT_RELATIONSHIP_OPTIONS]}
                value={defaultRelationship}
                onChange={(v) =>
                  setDefaultRelationship(v as ParentRelationship)
                }
                placeholder="Default relationship"
              />
            </div>

            {selected.length > 0 ? (
              <Card>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Selected ({selected.length})
                </h4>
                <ul className="space-y-2">
                  {selected.map((s) => (
                    <li
                      key={s.studentUserId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-0"
                    >
                      <span className="text-sm text-slate-800">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <Select
                          className="min-w-36"
                          options={[...PARENT_RELATIONSHIP_OPTIONS]}
                          value={s.relationship}
                          onChange={(v) =>
                            updateRelationship(
                              s.studentUserId,
                              v as ParentRelationship,
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setSelected((prev) =>
                              prev.filter(
                                (x) => x.studentUserId !== s.studentUserId,
                              ),
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            <div className="rounded-lg border border-[#D7E3FC] max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-slate-500">Loading…</div>
              ) : students.length === 0 ? (
                <div className="p-4 text-sm text-slate-500">
                  No students found.
                </div>
              ) : (
                <ul>
                  {students.map((student) => {
                    const already = linkedSet.has(student.id);
                    const isSelected = selectedIds.has(student.id);
                    return (
                      <li
                        key={student.id}
                        className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-[#D7E3FC] last:border-0 ${
                          already ? "opacity-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {student.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {[student.className, student.section]
                              .filter(Boolean)
                              .join(" - ") || "No class"}
                            {student.studentId
                              ? ` · ${student.studentId}`
                              : ""}
                          </div>
                        </div>
                        <Button
                          variant={isSelected ? "dark" : "ghost"}
                          disabled={already}
                          onClick={() => toggleStudent(student)}
                        >
                          {already
                            ? "Linked"
                            : isSelected
                              ? "Selected"
                              : "Select"}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={() => void handleSubmit()}
                disabled={link.isPending || selected.length === 0}
              >
                {link.isPending ? "Linking…" : "Link Children"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
