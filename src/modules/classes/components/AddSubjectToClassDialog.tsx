"use client";

import React, { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import DefaultSelect from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SuccessModal from "@/components/ui/SuccessModal";
import { useParams } from "next/navigation";
import { assignSubjectToClass } from "@/modules/classes/api/classSubjects";
import { fetchSubjects } from "@/modules/subjects";
import { fetchTeachers } from "@/modules/teachers";

type SubjectOption = { id: string; name: string };
type TeacherOption = {
  id: string;
  name: string;
  subjectsSpeciality: string[];
};

type Props = {
  open: boolean;
  onClose?: () => void;
  classId?: string;
  onSuccess?: () => void;
  /** Subject IDs already allocated to this class (disabled in the subject list). */
  allocatedSubjectIds?: string[];
};

function AddSubjectToClassDialog({
  open,
  onClose,
  classId,
  onSuccess,
  allocatedSubjectIds = [],
}: Props) {
  const params = useParams?.() as { classId?: string; id?: string; clsId?: string } | null;
  const resolvedClassId =
    classId || params?.classId || params?.clsId || params?.id || "";

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const allocatedSet = useMemo(
    () => new Set(allocatedSubjectIds.filter(Boolean)),
    [allocatedSubjectIds],
  );

  const subjectOptions = useMemo(
    () => [
      { id: "", name: "-- Select --" },
      ...subjects.map((s) => ({
        id: s.id,
        name: allocatedSet.has(s.id) ? `${s.name} (Already added)` : s.name,
        disabled: allocatedSet.has(s.id),
      })),
    ],
    [subjects, allocatedSet],
  );

  const teacherOptions = useMemo(
    () => [
      { id: "", name: "-- Select --" },
      ...teachers.map((t) => {
        const specialty =
          t.subjectsSpeciality.length > 0
            ? t.subjectsSpeciality.join(", ")
            : null;
        return {
          id: t.id,
          name: specialty ? `${t.name} — ${specialty}` : t.name,
        };
      }),
    ],
    [teachers],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!open) return;
      setLoading(true);
      setLoadingTeachers(true);
      setError(null);

      try {
        const [subjRes, teachRes] = await Promise.all([
          fetchSubjects({ page: 1, pageSize: 100 }),
          fetchTeachers({ page: 1, pageSize: 100 }),
        ]);

        if (cancelled) return;

        setSubjects(
          (subjRes.subjects ?? []).map((s) => ({
            id: String(s.id),
            name: s.name || "Unnamed Subject",
          })),
        );

        setTeachers(
          (teachRes.teachers ?? []).map((t) => ({
            id: String(t.id),
            name: t.name || "Unnamed Teacher",
            subjectsSpeciality: Array.isArray(t.subjects)
              ? t.subjects.filter(Boolean)
              : [],
          })),
        );
      } catch (err: unknown) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          setError(
            err.response?.data?.message ?? err.message ?? "Failed to fetch",
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingTeachers(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!selected) return;
    if (allocatedSet.has(selected)) {
      setError("This subject is already allocated to the class");
      return;
    }
    if (!resolvedClassId) {
      setError("Class id is missing");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: { subjectId: string; teacherId?: string } = {
        subjectId: selected,
      };
      if (selectedTeacher) payload.teacherId = selectedTeacher;
      await assignSubjectToClass(resolvedClassId, payload);
      setSuccessOpen(true);
      setSelected("");
      setSelectedTeacher("");
      onSuccess?.();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? err.message ?? "Failed to add subject",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add subject");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelected("");
    setSelectedTeacher("");
    setError(null);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-[777px] p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
        <div className="rounded-lg">
          <div className="min-h-full">
            <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
              <div>
                <h3 className="text-[24px] font-[700] text-white">
                  Add Subject to Class
                </h3>
                <p className="text-[14px] font-[400] text-white">
                  Select a subject and optionally assign a teacher.
                </p>
              </div>
              <div>
                <button
                  aria-label="close"
                  onClick={handleClose}
                  className="text-white hover:text-white/80"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-[16px] bg-white overflow-hidden rounded-b-lg max-h-full">
              <Card>
                <h1 className="text-[16px] text-[#0F172A] font-semibold mb-[24px]">
                  Subject Assignment
                </h1>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Select Subject
                    </label>
                    {loading ? (
                      <div className="text-sm text-slate-500">
                        Loading subjects...
                      </div>
                    ) : (
                      <DefaultSelect
                        options={subjectOptions}
                        value={selected}
                        onChange={(v) => setSelected(v)}
                        placeholder="Select Subject"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Assign Teacher (optional)
                    </label>
                    {loadingTeachers ? (
                      <div className="text-sm text-slate-500">
                        Loading teachers...
                      </div>
                    ) : (
                      <DefaultSelect
                        options={teacherOptions}
                        value={selectedTeacher}
                        onChange={(v) => setSelectedTeacher(v)}
                        placeholder="Select Teacher"
                      />
                    )}
                  </div>

                  {error ? (
                    <div className="text-sm text-red-600">{error}</div>
                  ) : null}
                </div>
              </Card>

              <div className="mt-6 flex sticky bottom-0 justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  onClick={handleSubmit}
                  disabled={!selected || submitting || allocatedSet.has(selected)}
                >
                  {submitting ? "Adding…" : "Add Subject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          handleClose();
        }}
        title="Subject added"
        description="The subject has been successfully added to the class."
      />
    </div>
  );
}

export default AddSubjectToClassDialog;
