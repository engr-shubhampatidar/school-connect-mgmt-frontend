"use client";

import React, { useEffect, useState } from "react";
import Portal from "@/app/Portal";
import DefaultSelect from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import SuccessModal from "@/components/ui/SuccessModal";
import { useParams } from "next/navigation";
import API from "@/lib/axios";
import { ADMIN_API } from "@/lib/api-routes";
import axios from "axios";

type Subject = { id: string; name: string };

function AddSubjectToClassDialog({
  open,
  onClose,
  classId,
  onSuccess,
}: {
  open: boolean;
  onClose?: () => void;
  classId?: string;
  onSuccess?: () => void;
}) {
  const params = useParams?.() as any;
  const resolvedClassId = classId || params?.classId || params?.id || "";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSubjectsAndTeachers = async () => {
      if (!open) return;
      setLoading(true);
      setLoadingTeachers(true);
      setError(null);
      try {
        const subjRes = await API.get(ADMIN_API.SUBJECTS);
        const subjData = subjRes.data;
        const subjList = Array.isArray(subjData)
          ? subjData
          : Array.isArray(subjData?.items)
            ? subjData.items
            : [];
        const normalizedSubjects = subjList.map((s: any) => ({
          id: s.id,
          name: s.name || s.title || s.subjectName || "Unnamed Subject",
        }));
        if (!cancelled) setSubjects(normalizedSubjects);

        const teachRes = await API.get(ADMIN_API.TEACHERS);
        const teachData = teachRes.data;
        const teachList = Array.isArray(teachData)
          ? teachData
          : Array.isArray(teachData?.items)
            ? teachData.items
            : [];
        const normalizedTeachers = teachList.map((t: any) => ({
          id: t.id,
          name:
            t.fullName ||
            t.user?.fullName ||
            t.user?.full_name ||
            [t.firstName, t.lastName].filter(Boolean).join(" ") ||
            "Unnamed Teacher",
        }));
        if (!cancelled) setTeachers(normalizedTeachers);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
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

    fetchSubjectsAndTeachers();
    return () => {
      cancelled = true;
    };
  }, [open, resolvedClassId]);

  const handleSubmit = async () => {
    if (!selected) return;
    if (!resolvedClassId) {
      setError("Class id is missing");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = { subjectId: selected };
      if (selectedTeacher) payload.teacherId = selectedTeacher;
      const url = `${ADMIN_API.CLASSES}/${resolvedClassId}/subjects`;
      const resp = await API.post(url, payload);
      setSuccessOpen(true);
      setSelected("");
      setSelectedTeacher("");
      onSuccess?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
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
    setError(null);
    onClose?.();
  };

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

        <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Add Subject to Class</h3>
            <button onClick={handleClose} className="text-slate-500">
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block text-sm text-slate-700">
              Select Subject
            </label>

            {loading ? (
              <div className="text-sm text-slate-500">Loading subjects...</div>
            ) : (
              <DefaultSelect
                options={[
                  { id: "", name: "-- Select --" },
                  ...subjects.map((s) => ({ id: s.id, name: s.name })),
                ]}
                value={selected}
                onChange={(v) => setSelected(v)}
                placeholder="Select Subject"
              />
            )}

            {/* Teacher select below subject */}
            <div className="mt-2">
              <label className="block text-sm text-slate-700">
                Assign Teacher (optional)
              </label>
              {loadingTeachers ? (
                <div className="text-sm text-slate-500">
                  Loading teachers...
                </div>
              ) : (
                <DefaultSelect
                  options={[
                    { id: "", name: "-- Select --" },
                    ...teachers.map((t) => ({ id: t.id, name: t.name })),
                  ]}
                  value={selectedTeacher}
                  onChange={(v) => setSelectedTeacher(v)}
                  placeholder="Select Teacher"
                />
              )}
            </div>

            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selected || submitting}>
              {submitting ? "Adding..." : "Add Subject"}
            </Button>
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
    </Portal>
  );
}

export default AddSubjectToClassDialog;
