"use client";

import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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
    Array<{
      id: string;
      name: string;
      studentId?: string | null;
    }>
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
    if (
      !open ||
      mode !== "student" ||
      !classId ||
      studentSearch.trim().length < 2
    ) {
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
    if (item.categoryType !== "TRANSPORT") {
      return item.amount;
    }

    const row = rowState[item.structureItemId];
    const dist = Number(row?.transportDistanceKm);

    if (!dist || dist <= 0) {
      return item.amount;
    }

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

        if (item.requirement === "MANDATORY") {
          return !item.alreadyAssigned;
        }

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
        if (!studentUserId) {
          throw new Error("Select a student");
        }

        await onAssignStudent({
          studentUserId,
          academicYear: academicYear.trim(),
          items,
        });
      } else {
        if (!classId) {
          throw new Error("Select a class");
        }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[777px] max-h-full overflow-hidden overflow-y-auto p-4 no-scrollbar">
          <div className="rounded-lg">
            <div className="min-h-full">
              {/* Header */}
              <div className="sticky top-0 flex items-start justify-between gap-4 rounded-t-lg bg-[#021034] px-[16px] py-[24px]">
                <div>
                  <h3 className="text-[24px] font-[700] text-white">
                    Assign Fees
                  </h3>

                  <p className="text-[14px] font-[400] text-white">
                    Assign applicable fees to an individual student or an entire
                    class.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="close"
                  onClick={onClose}
                  disabled={loading}
                  className="text-white hover:text-white/80 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="max-h-full overflow-hidden rounded-b-lg bg-white p-[16px]">
                <Card>
                  <h1 className="mb-[24px] text-[16px] font-[600] text-[#0F172A]">
                    Fee Assignment
                  </h1>

                  <div className="flex flex-col gap-5">
                    {/* Assignment Mode */}
                    <div>
                      <h2 className="mb-3 text-[16px] font-[600] text-[#0F172A]">
                        Assignment Type
                      </h2>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                            mode === "student"
                              ? "bg-[#021034] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          onClick={() => {
                            setMode("student");
                            setStudentUserId("");
                            setStudentLabel("");
                            setStudentSearch("");
                          }}
                        >
                          Single Student
                        </button>

                        <button
                          type="button"
                          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                            mode === "class"
                              ? "bg-[#021034] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          onClick={() => {
                            setMode("class");
                            setStudentUserId("");
                            setStudentLabel("");
                            setStudentSearch("");
                          }}
                        >
                          Whole Class
                        </button>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div>
                      <h2 className="mb-3 text-[16px] font-[600] text-[#0F172A]">
                        Class Information
                      </h2>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Academic Year */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Academic Year
                          </label>

                          <input
                            type="text"
                            placeholder="2025-26"
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                          />
                        </div>

                        {/* Class */}
                        <div>
                          <label className="text-sm font-medium text-[#0F172A]">
                            Class
                          </label>

                          <select
                            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034]"
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
                    </div>

                    {/* Student */}
                    {mode === "student" && (
                      <div>
                        <label className="text-sm font-medium text-[#0F172A]">
                          Student
                        </label>

                        <input
                          type="text"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#021034] disabled:bg-slate-50"
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
                          <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white text-sm shadow-sm">
                            {students.map((s) => (
                              <li key={s.id}>
                                <button
                                  type="button"
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50"
                                  onClick={() => {
                                    setStudentUserId(s.id);
                                    setStudentLabel(
                                      `${s.name}${
                                        s.studentId ? ` (${s.studentId})` : ""
                                      }`,
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
                            Optional — pick a student to see existing
                            assignments
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* Preview Information */}
                    {classId && academicYear.trim() && (
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            {previewLoading ? (
                              <p className="text-sm text-slate-500">
                                Loading fee plan...
                              </p>
                            ) : preview ? (
                              <p className="text-sm font-medium text-[#0F172A]">
                                Plan for{" "}
                                {preview.className ??
                                  (selectedClassLabel
                                    ? classLabel(selectedClassLabel)
                                    : "class")}
                                {" · "}
                                {preview.items.length} fee item
                                {preview.items.length === 1 ? "" : "s"}
                              </p>
                            ) : null}
                          </div>

                          <Button
                            variant="ghost"
                            disabled={previewLoading}
                            onClick={() => void loadPreview()}
                          >
                            Refresh
                          </Button>
                        </div>

                        {preview && !preview.policyFrequency ? (
                          <p className="mt-2 text-sm text-amber-700">
                            No class fee policy for this class and academic
                            year. Add a policy on the Structures page before
                            assigning.
                          </p>
                        ) : preview?.policyFrequency ? (
                          <p className="mt-2 text-sm text-slate-600">
                            Class policy:{" "}
                            {FEE_FREQUENCY_LABELS[preview.policyFrequency] ??
                              preview.policyFrequency}
                            {preview.policyFineType &&
                            preview.policyFineType !== "NONE"
                              ? ` · Fine ${
                                  FINE_TYPE_LABELS[preview.policyFineType] ??
                                  preview.policyFineType
                                }`
                              : ""}
                            {preview.policyStartDate
                              ? ` · Starts ${preview.policyStartDate.slice(
                                  0,
                                  10,
                                )}`
                              : ""}
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* Bulk Assignment Info */}
                    {mode === "class" && classId && academicYear && (
                      <p className="text-sm text-slate-600">
                        Mandatory fees apply to all students. Optional fees and
                        transport distance below are defaults for bulk
                        assignment.
                      </p>
                    )}

                    {/* Fee Items */}
                    {previewRows.length > 0 && (
                      <div>
                        <h2 className="mb-3 text-[16px] font-[600] text-[#0F172A]">
                          Fees to Assign
                        </h2>

                        <div className="overflow-x-auto rounded-md border border-slate-200">
                          <table className="min-w-full text-sm">
                            <thead className="bg-slate-50">
                              <tr className="text-left text-slate-600">
                                <th className="px-3 py-3 font-medium">
                                  Include
                                </th>
                                <th className="px-3 py-3 font-medium">
                                  Category
                                </th>
                                <th className="px-3 py-3 font-medium">Type</th>
                                <th className="px-3 py-3 font-medium">
                                  Amount
                                </th>
                                <th className="px-3 py-3 font-medium">
                                  Distance (km)
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {previewRows.map((item) => {
                                const row = rowState[item.structureItemId];

                                const mandatory =
                                  item.requirement === "MANDATORY";

                                const disabled = item.alreadyAssigned;

                                return (
                                  <tr
                                    key={item.structureItemId}
                                    className="border-t border-slate-200"
                                  >
                                    <td className="px-3 py-3">
                                      <input
                                        type="checkbox"
                                        checked={
                                          mandatory
                                            ? true
                                            : (row?.optedIn ?? false)
                                        }
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
                                        className="h-4 w-4"
                                      />
                                    </td>

                                    <td className="px-3 py-3 font-medium text-[#0F172A]">
                                      {item.categoryName}
                                    </td>

                                    <td className="px-3 py-3 text-slate-600">
                                      {item.requirement}

                                      {item.categoryType === "TRANSPORT" &&
                                        " · Transport"}

                                      {disabled && " · Assigned"}
                                    </td>

                                    <td className="px-3 py-3">
                                      {formatInr(displayAmount(item))}
                                    </td>

                                    <td className="px-3 py-3">
                                      {item.categoryType === "TRANSPORT" &&
                                      !disabled ? (
                                        <input
                                          type="number"
                                          min={0.01}
                                          step={0.1}
                                          className="w-24 rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-[#021034]"
                                          value={row?.transportDistanceKm ?? ""}
                                          onChange={(e) =>
                                            setRowState((prev) => ({
                                              ...prev,
                                              [item.structureItemId]: {
                                                optedIn:
                                                  prev[item.structureItemId]
                                                    ?.optedIn ?? item.selected,
                                                transportDistanceKm:
                                                  e.target.value,
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
                      </div>
                    )}

                    {/* Error */}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>
                </Card>

                {/* Footer */}
                <div className="sticky bottom-0 mt-6 flex justify-end gap-2 bg-white">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
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
                    {loading ? "Assigning..." : "Assign Fees"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
