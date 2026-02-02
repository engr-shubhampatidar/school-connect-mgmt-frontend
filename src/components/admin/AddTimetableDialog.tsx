"use client";

import React, { useEffect, useState } from "react";
import Portal from "@/app/Portal";
import DefaultSelect from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import SuccessModal from "@/components/ui/SuccessModal";
import Input from "@/components/ui/Input";
import API from "@/lib/axios";
import { ADMIN_API } from "@/lib/api-routes";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

type Option = { id: string; name: string };

function isTimeLess(a: string, b: string) {
  if (!a || !b) return false;
  return a < b;
}

export default function AddTimetableDialog({
  open,
  classId,
  onClose,
  onSuccess,
}: {
  open: boolean;
  classId?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const params = useParams?.() as any;
  const router = useRouter?.();
  const resolvedClassId = classId || params?.classId || params?.id || "";

  const [subjects, setSubjects] = useState<Option[]>([]);
  const [teachers, setTeachers] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      if (!open) return;
      setLoading(true);
      setLoadingTeachers(true);
      setError(null);
      try {
        // Try class-specific subjects endpoint first, fallback to global subjects
        const subjUrl = `${ADMIN_API.CLASSES}/${resolvedClassId}/timetable/subjects`;
        let subjRes;
        try {
          subjRes = await API.get(subjUrl);
        } catch (err) {
          subjRes = await API.get(ADMIN_API.SUBJECTS);
        }
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
            t.name || t.user?.fullName || t.user?.full_name ||
            [t.firstName, t.lastName].filter(Boolean).join(" ") ||
            "Unnamed Teacher",
        }));
        if (!cancelled) setTeachers(normalizedTeachers);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message ?? err.message ?? "Failed to fetch");
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

    fetch();
    return () => {
      cancelled = true;
    };
  }, [open, resolvedClassId]);

  const resetAndClose = () => {
    setSubjectId("");
    setTeacherId("");
    setDayOfWeek("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setError(null);
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!subjectId || dayOfWeek === "" || !startTime || !endTime) {
      setError("Please fill all required fields");
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
      const payload: any = {
        subjectId,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        room,
      };
      if (teacherId) payload.teacherId = teacherId;
      const url = `${ADMIN_API.CLASSES}/${resolvedClassId}/timetable`;
      await API.post(url, payload);
      setSuccessOpen(true);
      onSuccess?.();
      // Optionally, refresh the page or data
      router?.refresh?.();
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message ?? "Failed to add timetable entry");
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
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={resetAndClose} />

        <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Add Timetable Entry</h3>
            <button onClick={resetAndClose} className="text-slate-500">✕</button>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block text-sm text-slate-700">Subject</label>
            {loading ? (
              <div className="text-sm text-slate-500">Loading subjects...</div>
            ) : (
              <DefaultSelect
                options={[{ id: "", name: "-- Select --" }, ...subjects]}
                value={subjectId}
                onChange={(v) => setSubjectId(v)}
                placeholder="Select Subject"
              />
            )}

            <div>
              <label className="block text-sm text-slate-700">Teacher</label>
              {loadingTeachers ? (
                <div className="text-sm text-slate-500">Loading teachers...</div>
              ) : (
                <DefaultSelect
                  options={[{ id: "", name: "-- Select --" }, ...teachers]}
                  value={teacherId}
                  onChange={(v) => setTeacherId(v)}
                  placeholder="Select Teacher"
                />
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700">Day of Week</label>
              <DefaultSelect
                options={[
                  { id: "", name: "-- Select --" },
                  { id: "0", name: "Sunday" },
                  { id: "1", name: "Monday" },
                  { id: "2", name: "Tuesday" },
                  { id: "3", name: "Wednesday" },
                  { id: "4", name: "Thursday" },
                  { id: "5", name: "Friday" },
                  { id: "6", name: "Saturday" },
                ]}
                value={dayOfWeek}
                onChange={(v) => setDayOfWeek(v)}
                placeholder="Select Day"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-slate-700">Start Time</label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-700">End Time</label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700">Room</label>
              <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 101" />
            </div>

            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={resetAndClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Adding..." : "Add Timetable"}
            </Button>
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
    </Portal>
  );
}
