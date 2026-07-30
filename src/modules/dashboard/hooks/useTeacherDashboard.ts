"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthenticatedLoad } from "@/hooks/useAuthenticatedLoad";
import { ensureSessionReady, getUser } from "@/modules/auth";
import {
  getTeacherDashboard,
  type TeacherDashboard,
  type TodayScheduleItem,
} from "@/modules/teachers";
import { mapAssignedSubjects } from "@/modules/teachers";

function formatTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
}

function getScheduleStatus(
  startTime: string,
  endTime: string,
): "completed" | "current" | "upcoming" {
  const now = new Date();
  const [sh, sm, ss] = startTime.split(":").map(Number);
  const [eh, em, es] = endTime.split(":").map(Number);
  const start = new Date(now);
  start.setHours(sh || 0, sm || 0, ss || 0, 0);
  const end = new Date(now);
  end.setHours(eh || 0, em || 0, es || 0, 0);
  if (now >= end) return "completed";
  if (now >= start && now < end) return "current";
  return "upcoming";
}

function formatTodayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDayLabel(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function mapSchedule(schedule: TodayScheduleItem[]) {
  return schedule.map((item) => ({
    time: formatTime(item.startTime),
    title: item.subject,
    subtitle: `Class ${item.class}-${item.section}${item.room ? ` Room-${item.room}` : ""}`,
    status: getScheduleStatus(item.startTime, item.endTime),
  }));
}

function getNextClass(schedule: TodayScheduleItem[]): string {
  const next =
    schedule.find(
      (item) => getScheduleStatus(item.startTime, item.endTime) === "current",
    ) ??
    schedule.find(
      (item) => getScheduleStatus(item.startTime, item.endTime) === "upcoming",
    );
  return next?.subject ?? "—";
}

/**
 * Loads the teacher dashboard and derives every value the page renders.
 */
export function useTeacherDashboard() {
  const load = useCallback(
    (): Promise<TeacherDashboard> => getTeacherDashboard(),
    [],
  );

  const { data, loading } = useAuthenticatedLoad("teacher", load, {
    errorTitle: "Unable to load",
  });

  // Profile name is only available once the session has been restored.
  const [storedName, setStoredName] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;

    async function readStoredName() {
      await ensureSessionReady();
      if (!mounted) return;
      setStoredName(getUser<{ name?: string }>("teacher")?.name ?? null);
    }

    readStoredName();
    return () => {
      mounted = false;
    };
  }, []);

  const assignedClass = data?.assignedClass ?? null;
  const assignedSubjects = data?.assignedSubjects ?? [];
  const todaySchedule = data?.todaySchedule ?? [];

  const nameFromSubjects = assignedSubjects.find(
    (s) => s.teacherName,
  )?.teacherName;
  const hasClass = Boolean(assignedClass?.classId);
  const attendanceDone =
    assignedClass?.attendanceStatus?.toUpperCase() === "COMPLETED";

  return {
    loading,
    teacherName: nameFromSubjects ?? storedName ?? "Teacher",
    todayLabel: formatTodayLabel(),
    dayLabel: getDayLabel(),
    hasClass,
    classLabel: hasClass
      ? `${assignedClass!.class}${assignedClass!.section ? `-${assignedClass!.section}` : ""}`
      : null,
    room: assignedClass?.room ?? null,
    totalStudents: assignedClass?.totalStudents ?? 0,
    attendanceDone,
    nextClass: getNextClass(todaySchedule),
    subjects: mapAssignedSubjects(assignedSubjects),
    schedules: mapSchedule(todaySchedule),
  };
}
