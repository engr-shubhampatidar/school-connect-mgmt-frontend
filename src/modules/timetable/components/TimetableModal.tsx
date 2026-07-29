"use client";
import React, { useEffect, useState } from "react";
import { type Subject, fetchSubjects } from "@/modules/subjects";
import { type Teacher, fetchTeachers } from "@/modules/teachers";
import type {
  CreateTimetableEntryDto,
  UpdateTimetableEntryDto,
  TimetableEntryDto,
} from "@/modules/timetable/types/timetable";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (entry: TimetableEntryDto) => void;
  classId: string;
  existingEntries: TimetableEntryDto[];
  initial?: Partial<TimetableEntryDto>;
  mode?: "create" | "edit";
  onSubmit: (payload: any) => Promise<TimetableEntryDto>;
};

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function TimetableModal({
  open,
  onClose,
  onSaved,
  classId,
  existingEntries,
  initial,
  mode = "create",
  onSubmit,
}: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjectId, setSubjectId] = useState<string>(initial?.subjectId ?? "");
  const [teacherId, setTeacherId] = useState<string | undefined>(
    initial?.teacherId ?? "",
  );
  const [dayOfWeek, setDayOfWeek] = useState<number>(initial?.dayOfWeek ?? 1);
  const [startTime, setStartTime] = useState<string>(
    initial?.startTime ?? "08:00",
  );
  const [endTime, setEndTime] = useState<string>(initial?.endTime ?? "09:00");
  const [room, setRoom] = useState<string>(initial?.room ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchSubjects().then((r) => {
      if (!mounted) return;
      setSubjects(r.subjects ?? []);
    });
    fetchTeachers().then((r) => {
      if (!mounted) return;
      setTeachers(r.teachers ?? []);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setSubjectId(initial?.subjectId ?? "");
    setTeacherId(initial?.teacherId ?? "");
    setDayOfWeek(initial?.dayOfWeek ?? 1);
    setStartTime(initial?.startTime ?? "08:00");
    setEndTime(initial?.endTime ?? "09:00");
    setRoom(initial?.room ?? "");
    setError(null);
  }, [open, initial]);

  const checkOverlap = (skipId?: string | null) => {
    const s = toMinutes(startTime);
    const e = toMinutes(endTime);
    if (s >= e) {
      setError("Start time must be before end time");
      return true;
    }
    const clashes = existingEntries.filter(
      (it) => it.dayOfWeek === dayOfWeek && it.id !== skipId,
    );
    for (const it of clashes) {
      const is = toMinutes(it.startTime);
      const ie = toMinutes(it.endTime);
      if (s < ie && e > is) {
        setError(
          `Overlaps with ${it.subjectName ?? "entry"} ${it.startTime}-${
            it.endTime
          }`,
        );
        return true;
      }
    }
    setError(null);
    return false;
  };

  const handleSave = async () => {
    if (!subjectId) {
      setError("Subject is required");
      return;
    }
    if (checkOverlap(initial?.id ?? null)) return;
    setLoading(true);
    try {
      const payload: any = {
        subjectId,
        teacherId: teacherId || undefined,
        dayOfWeek,
        startTime,
        endTime,
        room: room || undefined,
      };
      const entry = await onSubmit(payload);
      onSaved(entry);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-md p-6 w-full max-w-lg shadow-lg">
        <h3 className="font-semibold mb-4">
          {mode === "create" ? "Add" : "Edit"} Timetable Entry
        </h3>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-xs text-slate-600">Subject</span>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="mt-1 p-2 border rounded"
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-slate-600">Teacher</span>
            <select
              value={teacherId ?? ""}
              onChange={(e) => setTeacherId(e.target.value || undefined)}
              className="mt-1 p-2 border rounded"
            >
              <option value="">Unassigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || t.user?.fullName || t.email}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-slate-600">Day</span>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="mt-1 p-2 border rounded"
            >
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
              <option value={7}>Sunday</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-slate-600">Room (optional)</span>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-slate-600">Start time</span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-xs text-slate-600">End time</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
