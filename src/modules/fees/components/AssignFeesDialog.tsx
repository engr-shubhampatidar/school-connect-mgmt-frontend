"use client";

import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { fetchStudents } from "@/modules/students/api/adminStudents";
import { fetchClasses, type ClassItem } from "@/modules/classes";
import {
  formatInr,
  previewFeeAssignment,
  resolveTransportAmount,
  FEE_FREQUENCY_LABELS,
  FINE_TYPE_LABELS,
} from "@/modules/fees";
import type {
  AssignmentPreviewItem,
  FeeAssignmentPreview,
  PackageAssignItem,
} from "@/modules/fees/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onAssignStudent: (payload: {
    studentUserId: string;
    academicYear: string;
    items: PackageAssignItem[];
  }) => Promise<void>;
  onBulkAssignClass: (payload: {
    classId: string;
    academicYear: string;
    items: PackageAssignItem[];
  }) => Promise<void>;
};

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

type RowState = {
  optedIn: boolean;
  transportDistanceKm: string;
};

function classLabel(c: ClassItem): string {
  return `${c.name}${c.section ? `-${c.section}` : ""}`;
}

export const AssignFeesDialog: FC<Props> = ({
  open,
  onClose,
  onAssignStudent,
  onBulkAssignClass,
}) => {
  const [mode, setMode] = useState<"student" | "class">("student");
  const [academicYear, setAcademicYear] = useState("");
  const [classId, setClassId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentUserId, setStudentUserId] = useState("");
  const [studentLabel, setStudentLabel] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<
    Array<{ id: string; name: string; studentId?: string | null }>
  >([]);
  const [preview, setPreview] = useState<FeeAssignmentPreview | null>(null);
  const [rowState, setRowState] = useState<Record<string, RowState>>({});
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initRowState = useCallback(
    (
      items: AssignmentPreviewItem[],
      previous: Record<string, RowState>,
    ): Record<string, RowState> => {
      const state: Record<string, RowState> = {};
      for (const item of items) {
        const prev = previous[item.structureItemId];
        state[item.structureItemId] = {
          optedIn: prev?.optedIn ?? (item.selected && !item.alreadyAssigned),
          transportDistanceKm: prev?.transportDistanceKm ?? "",
        };
      }
      return state;
    },
    [],
  );

  const loadPreview = useCallback(async () => {
    if (!classId || !academicYear.trim()) {
      setPreview(null);
      return;
    }

    setPreviewLoading(true);
    setError(null);
    try {
      const data = await previewFeeAssignment({
        classId,
        academicYear: academicYear.trim(),
        studentUserId:
          mode === "student" && studentUserId ? studentUserId : undefined,
      });
      setPreview(data);
      setRowState((prev) => initRowState(data.items, prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preview");
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  }, [academicYear, classId, initRowState, mode, studentUserId]);

  useEffect(() => {
    if (!open) return;
    setMode("student");
    setAcademicYear("");
    setClassId("");
    setStudentSearch("");
    setStudentUserId("");
    setStudentLabel("");
    setPreview(null);
    setRowState({});
    setError(null);
    setLoading(false);

    void fetchClasses({ page: 1, pageSize: 100 })
      .then((res) => setClasses(res.classes ?? []))
      .catch(() => setClasses([]));
  }, [open]);

  useEffect(() => {
    if (!open || mode !== "student" || !classId || studentSearch.trim().length < 2) {
      setStudents([]);
      return;
    }

    const t = setTimeout(() => {
      void fetchStudents({
        search: studentSearch,
        classId,
        page: 1,
        pageSize: 10,
      })
        .then((res) =>
          setStudents(
            res.students.map((s) => ({
              id: s.id,
              name: s.name,
              studentId: s.studentId != null ? String(s.studentId) : null,
            })),
          ),
        )
        .catch(() => setStudents([]));
    }, 300);

    return () => clearTimeout(t);
  }, [open, mode, classId, studentSearch]);

  useEffect(() => {
    if (!open || !classId || !academicYear.trim()) {
      setPreview(null);
      return;
    }

    const t = setTimeout(() => {
      void loadPreview();
    }, 300);

    return () => clearTimeout(t);
  }, [open, classId, academicYear, mode, studentUserId, loadPreview]);

  const displayAmount = (item: AssignmentPreviewItem): number => {
    if (item.categoryType !== "TRANSPORT") return item.amount;
    const row = rowState[item.structureItemId];
    const dist = Number(row?.transportDistanceKm);
    if (!dist || dist <= 0) return item.amount;
    if (item.transportSlabs?.length) {
      return resolveTransportAmount(dist, item.amount, item.transportSlabs);
    }
    return item.amount;
  };

  const buildItems = (): PackageAssignItem[] => {
    if (!preview) return [];
    return preview.items
      .filter((item) => {
        const row = rowState[item.structureItemId];
        if (item.requirement === "MANDATORY") return !item.alreadyAssigned;
        return row?.optedIn && !item.alreadyAssigned;
      })
      .map((item) => {
        const row = rowState[item.structureItemId];
        const payload: PackageAssignItem = {
          structureItemId: item.structureItemId,
          optedIn: true,
        };
        if (item.categoryType === "TRANSPORT" && row?.transportDistanceKm) {
          payload.transportDistanceKm = Number(row.transportDistanceKm);
        }
        return payload;
      });
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = buildItems();
      if (!items.length) {
        throw new Error("No fees selected to assign");
      }
      if (mode === "student") {
        if (!studentUserId) throw new Error("Select a student");
        await onAssignStudent({
          studentUserId,
          academicYear: academicYear.trim(),
          items,
        });
      } else {
        if (!classId) throw new Error("Select a class");
        await onBulkAssignClass({
          classId,
          academicYear: academicYear.trim(),
          items,
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const previewRows = useMemo(() => preview?.items ?? [], [preview]);
  const selectedClassLabel = classes.find((c) => c.id === classId);

  if (!open) return null;

  return (
    <div style={backdrop} onClick={onClose}>
      <div
        className="w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-md bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#021034]">Assign fees</h2>

        <div className="mt-3 flex gap-2">
          <button
            className={`rounded px-3 py-1 text-sm ${
              mode === "student"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
            onClick={() => {
              setMode("student");
              setStudentUserId("");
              setStudentLabel("");
              setStudentSearch("");
            }}
          >
            Single student
          </button>
          <button
            className={`rounded px-3 py-1 text-sm ${
              mode === "class"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
            onClick={() => {
              setMode("class");
              setStudentUserId("");
              setStudentLabel("");
              setStudentSearch("");
            }}
          >
            Whole class
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600">Academic year</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              placeholder="2025-26"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Class</label>
            <select
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setStudentUserId("");
                setStudentLabel("");
                setStudentSearch("");
                setStudents([]);
              }}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {classLabel(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {mode === "student" && (
          <div className="mt-3">
            <label className="text-sm text-slate-600">Student</label>
            <input
              className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              placeholder={
                classId
                  ? "Search students in selected class"
                  : "Select a class first"
              }
              value={studentSearch}
              disabled={!classId}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
            {students.length > 0 && (
              <ul className="mt-1 max-h-32 overflow-y-auto rounded border border-slate-200 text-sm">
                {students.map((s) => (
                  <li key={s.id}>
                    <button
                      className="w-full px-3 py-2 text-left hover:bg-slate-50"
                      onClick={() => {
                        setStudentUserId(s.id);
                        setStudentLabel(
                          `${s.name}${s.studentId ? ` (${s.studentId})` : ""}`,
                        );
                        setStudentSearch(s.name);
                        setStudents([]);
                      }}
                    >
                      {s.name}
                      {s.studentId ? ` — ${s.studentId}` : ""}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {studentLabel ? (
              <p className="mt-1 text-xs text-slate-500">
                Selected: {studentLabel}
              </p>
            ) : classId ? (
              <p className="mt-1 text-xs text-slate-500">
                Optional — pick a student to see existing assignments
              </p>
            ) : null}
          </div>
        )}

        {classId && academicYear.trim() && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3">
              {previewLoading ? (
                <p className="text-sm text-slate-500">Loading fee plan...</p>
              ) : preview ? (
                <p className="text-sm text-slate-600">
                  Plan for{" "}
                  {preview.className ??
                    (selectedClassLabel
                      ? classLabel(selectedClassLabel)
                      : "class")}
                  · {preview.items.length} fee item
                  {preview.items.length === 1 ? "" : "s"}
                </p>
              ) : null}
              <Button
                variant="ghost"
                disabled={previewLoading}
                onClick={() => void loadPreview()}
              >
                Refresh
              </Button>
            </div>
            {preview && !preview.policyFrequency ? (
              <p className="text-sm text-amber-700">
                No class fee policy for this class and academic year. Add a
                policy on the Structures page before assigning.
              </p>
            ) : preview?.policyFrequency ? (
              <p className="text-sm text-slate-600">
                Class policy:{" "}
                {FEE_FREQUENCY_LABELS[preview.policyFrequency] ??
                  preview.policyFrequency}
                {preview.policyFineType &&
                preview.policyFineType !== "NONE"
                  ? ` · Fine ${FINE_TYPE_LABELS[preview.policyFineType] ?? preview.policyFineType}`
                  : ""}
                {preview.policyStartDate
                  ? ` · Starts ${preview.policyStartDate.slice(0, 10)}`
                  : ""}
              </p>
            ) : null}
          </div>
        )}

        {mode === "class" && classId && academicYear && (
          <p className="mt-2 text-sm text-slate-600">
            Mandatory fees apply to all students. Optional fees and transport
            distance below are defaults for bulk assignment.
          </p>
        )}

        {previewRows.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Include</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2">Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((item) => {
                  const row = rowState[item.structureItemId];
                  const mandatory = item.requirement === "MANDATORY";
                  const disabled = item.alreadyAssigned;
                  return (
                    <tr key={item.structureItemId} className="border-t">
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={mandatory ? true : row?.optedIn ?? false}
                          disabled={mandatory || disabled}
                          onChange={(e) =>
                            setRowState((prev) => ({
                              ...prev,
                              [item.structureItemId]: {
                                ...prev[item.structureItemId],
                                optedIn: e.target.checked,
                              },
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 pr-3 font-medium">
                        {item.categoryName}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">
                        {item.requirement}
                        {item.categoryType === "TRANSPORT" ? " · Transport" : ""}
                        {disabled ? " · Assigned" : ""}
                      </td>
                      <td className="py-2 pr-3">
                        {formatInr(displayAmount(item))}
                      </td>
                      <td className="py-2">
                        {item.categoryType === "TRANSPORT" && !disabled ? (
                          <input
                            type="number"
                            min={0.01}
                            step={0.1}
                            className="w-24 rounded border border-slate-200 px-2 py-1 text-sm"
                            value={row?.transportDistanceKm ?? ""}
                            onChange={(e) =>
                              setRowState((prev) => ({
                                ...prev,
                                [item.structureItemId]: {
                                  optedIn:
                                    prev[item.structureItemId]?.optedIn ??
                                    item.selected,
                                  transportDistanceKm: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="dark"
            disabled={
              loading ||
              !academicYear.trim() ||
              !classId ||
              previewRows.length === 0 ||
              !preview?.policyFrequency ||
              (mode === "student" && !studentUserId)
            }
            onClick={() => void submit()}
          >
            {loading ? "Assigning..." : "Assign fees"}
          </Button>
        </div>
      </div>
    </div>
  );
};
