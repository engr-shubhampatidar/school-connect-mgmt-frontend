"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthenticatedLoad } from "@/hooks/useAuthenticatedLoad";
import { getTeacherClass, type TeacherClass } from "@/modules/teachers";
import type { AttendanceValue } from "@/components/ui/AttendanceStatusBar";
import {
  fetchAttendanceForClassDate,
  markAttendance,
} from "@/modules/attendance/api/attendance";

export type AttendanceStudentRow = {
  id: string;
  studentId: string;
  name: string;
  status?: AttendanceValue;
};

type ClassRoster = {
  klass: TeacherClass | null;
  students: Array<{ id?: string; studentId: string; name: string }>;
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Reads the saved statuses of an attendance record, or null when the date is unmarked. */
function toStatusMap(
  record: unknown,
): Record<string, AttendanceValue | undefined> | null {
  const payload = record as
    | {
        attendanceTaken?: boolean;
        status?: string;
        students?: unknown;
      }
    | undefined;

  if (payload?.attendanceTaken === false) return null;
  if (payload?.status === "NOT_MARKED") return null;

  const students = payload?.students;
  if (!Array.isArray(students) || students.length === 0) return null;

  return students.reduce<Record<string, AttendanceValue | undefined>>(
    (acc, cur) => {
      const entry = cur as {
        studentId?: string;
        id?: string;
        status?: string;
      };
      const id = entry.studentId ?? entry.id;
      if (id) acc[id] = (entry.status as AttendanceValue) || undefined;
      return acc;
    },
    {},
  );
}

function defaultPresentMap(
  roster: Array<{ id?: string }> | undefined,
): Record<string, AttendanceValue> {
  const defaults: Record<string, AttendanceValue> = {};
  for (const s of roster ?? []) {
    const key = s.id ?? "";
    if (key) defaults[key] = "PRESENT";
  }
  return defaults;
}

/**
 * Teacher attendance state: class roster, statuses for the selected date, and save.
 */
export function useTeacherAttendance() {
  const { toast } = useToast();
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [date, setDate] = useState<string>(todayISO());
  const [statuses, setStatuses] = useState<
    Record<string, AttendanceValue | undefined>
  >({});
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (): Promise<ClassRoster> => {
    const { class: classData, students: classStudents } =
      await getTeacherClass();
    return {
      klass: classData ?? null,
      students: (classStudents ?? []).map((s) => ({
        id: s.id,
        studentId: s.studentId,
        name: s.name ?? "",
      })),
    };
  }, []);

  const { data, loading } = useAuthenticatedLoad("teacher", load, {
    errorTitle: "Unable to load class",
  });

  const klass = data?.klass ?? null;
  const classId = klass?.id;
  const roster = data?.students;
  const rosterReady = Boolean(roster);
  const rosterRef = useRef(roster);
  rosterRef.current = roster;

  useEffect(() => {
    if (!classId || !rosterReady) return;
    let mounted = true;

    async function loadAttendance(id: string) {
      const currentRoster = rosterRef.current;

      const applyDefaults = () => {
        setStatuses(defaultPresentMap(currentRoster));
        setAttendanceExists(false);
        toastRef.current({
          title: "All students set to Present",
          description:
            "Attendance has not been taken yet. Everyone is Present by default — update any absent or late students before saving.",
          type: "info",
        });
      };

      try {
        const record = await fetchAttendanceForClassDate(id, date);
        if (!mounted) return;
        const map = toStatusMap(record);
        if (!map) {
          applyDefaults();
          return;
        }

        const byRosterId: Record<string, AttendanceValue | undefined> = {};
        for (const s of currentRoster ?? []) {
          const key = s.id ?? "";
          if (!key) continue;
          byRosterId[key] = map[key] ?? map[s.studentId] ?? "PRESENT";
        }
        setStatuses(byRosterId);
        setAttendanceExists(true);
      } catch {
        if (mounted) applyDefaults();
      }
    }

    loadAttendance(classId);
    return () => {
      mounted = false;
    };
  }, [classId, date, rosterReady]);

  const students = useMemo<AttendanceStudentRow[]>(
    () =>
      (roster ?? []).map((s) => ({
        id: s.id ?? "",
        studentId: s.studentId,
        name: s.name,
        status: statuses[s.id ?? ""],
      })),
    [roster, statuses],
  );

  const setStatus = useCallback((id: string, status: AttendanceValue) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    if (!classId) return false;

    if (new Date(date) > new Date()) {
      toastRef.current({
        title: "Invalid date",
        description: "Cannot mark attendance for future dates",
        type: "error",
      });
      return false;
    }

    setSubmitting(true);
    try {
      await markAttendance({
        classId,
        date,
        students: students.map((s) => ({
          studentId: s.id,
          status: s.status ?? "ABSENT",
        })),
      });
      toastRef.current({
        title: "Saved",
        description: "Attendance saved successfully",
        type: "success",
      });
      setAttendanceExists(true);
      return true;
    } catch (err: unknown) {
      let message = "Unable to save";
      if (typeof err === "object" && err !== null && "message" in err) {
        message = (err as { message?: string }).message ?? message;
      }
      toastRef.current({
        title: "Save failed",
        description: message,
        type: "error",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [classId, date, students]);

  return {
    loading,
    klass,
    students,
    date,
    setDate,
    maxDate: todayISO(),
    attendanceExists,
    submitting,
    setStatus,
    save,
  };
}
