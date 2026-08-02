"use client";

import React, { useEffect, useMemo, useState } from "react";
import DefaultSelect from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SuccessModal from "@/components/ui/SuccessModal";
import { Input } from "@/components/ui/Input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { updateTimetableBySubject } from "@/modules/timetable/api/timetable";
import type { ClassTimetableEntry } from "@/modules/timetable/types/timetable";
import type { ClassSubjectAllocation } from "@/modules/classes/components/SubjectAllocationTable";

type Props = {
  open: boolean;
  classId?: string;
  onClose?: () => void;
  onSuccess?: () => void;
  /** Subjects already allocated to the class. */
  allocatedSubjects?: ClassSubjectAllocation[];
  /** Existing timetable entries — subjects present here are excluded. */
  timetableItems?: ClassTimetableEntry[];
  /** Optional room from class details. */
  room?: string | null;
};

function isTimeLess(a: string, b: string) {
  if (!a || !b) return false;
  return a < b;
}

export default function AddTimetableDialog({
  open,
  classId,
  onClose,
  onSuccess,
  allocatedSubjects = [],
  timetableItems = [],
  room: classRoom = null,
}: Props) {
  const params = useParams?.() as {
    classId?: string;
    id?: string;
    clsId?: string;
  } | null;
  const router = useRouter?.();
  const resolvedClassId =
    classId || params?.classId || params?.clsId || params?.id || "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const availableSubjects = useMemo(() => {
    const timedSubjectIds = new Set(
      timetableItems.map((t) => t.subjectId).filter(Boolean),
    );
    return allocatedSubjects.filter(
      (s) => s.subjectId && !timedSubjectIds.has(s.subjectId),
    );
  }, [allocatedSubjects, timetableItems]);

  const subjectOptions = useMemo(
    () => [
      { id: "", name: "-- Select --" },
      ...availableSubjects.map((s) => ({
        id: s.subjectId,
        name: s.subjectName || "Unnamed Subject",
      })),
    ],
    [availableSubjects],
  );

  const teacherOptions = useMemo(() => {
    if (!teacherId) {
      return [{ id: "", name: "No teacher assigned" }];
    }
    return [
      {
        id: teacherId,
        name: teacherName || "Assigned Teacher",
      },
    ];
  }, [teacherId, teacherName]);

  useEffect(() => {
    if (!open) return;
    setSubjectId("");
    setTeacherId("");
    setTeacherName("");
    setStartTime("");
    setEndTime("");
    setError(null);
  }, [open]);

  const handleSubjectChange = (id: string) => {
    setSubjectId(id);
    const selected = availableSubjects.find((s) => s.subjectId === id);
    setTeacherId(selected?.teacherId ?? "");
    setTeacherName(selected?.teacherName ?? "");
  };

  const resetAndClose = () => {
    setSubjectId("");
    setTeacherId("");
    setTeacherName("");
    setStartTime("");
    setEndTime("");
    setError(null);
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!subjectId) {
      setError("Please select a subject");
      return;
    }
    if (!teacherId) {
      setError("Selected subject has no assigned teacher");
      return;
    }
    if (!startTime || !endTime) {
      setError("Start time and end time are required");
      return;
    }
    if (!isTimeLess(startTime, endTime)) {
      setError("Start time must be earlier than end time");
      return;
    }
    if (!resolvedClassId) {
      setError("Class id is missing");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await updateTimetableBySubject(resolvedClassId, subjectId, {
        teacherId,
        dayOfWeek: 0,
        startTime,
        endTime,
        room: classRoom ?? null,
      });
      setSuccessOpen(true);
      onSuccess?.();
      router?.refresh?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            err.message ??
            "Failed to add timetable entry",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add timetable entry");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={resetAndClose} />
      <div className="relative w-full max-w-lg p-4 max-h-full overflow-hidden no-scrollbar overflow-y-auto">
        <div className="rounded-lg">
          <div className="flex items-start sticky top-0 bg-[#021034] rounded-t-lg py-[24px] px-[16px] justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-[700] text-white">
                Add Timetable Entry
              </h3>
              <p className="text-[14px] font-[400] text-white">
                Schedule a period for a subject that does not have a timetable
                yet.
              </p>
            </div>
            <div>
              <button
                aria-label="close"
                onClick={resetAndClose}
                className="text-white hover:text-white/80"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-[16px] bg-white overflow-hidden rounded-b-lg max-h-full">
            <Card>
              <h1 className="text-[16px] text-[#0F172A] font-semibold font-[600] mb-[24px]">
                Period Information
              </h1>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Subject
                  </label>
                  {availableSubjects.length === 0 ? (
                    <div className="text-sm text-slate-500">
                      All allocated subjects already have a timetable entry.
                    </div>
                  ) : (
                    <DefaultSelect
                      options={subjectOptions}
                      value={subjectId}
                      onChange={handleSubjectChange}
                      placeholder="Select Subject"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Teacher
                  </label>
                  <DefaultSelect
                    options={teacherOptions}
                    value={teacherId}
                    onChange={() => undefined}
                    placeholder="Assigned Teacher"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {error ? (
                  <div className="text-sm text-red-600">{error}</div>
                ) : null}
              </div>
            </Card>

            <div className="mt-6 flex sticky bottom-0 justify-end gap-2">
              <Button type="button" variant="ghost" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="dark"
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !subjectId ||
                  !teacherId ||
                  !startTime ||
                  !endTime ||
                  availableSubjects.length === 0
                }
              >
                {submitting ? "Adding…" : "Add Timetable"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          resetAndClose();
        }}
        title="Timetable entry added"
        description="The timetable entry has been successfully added."
      />
    </div>
  );
}
