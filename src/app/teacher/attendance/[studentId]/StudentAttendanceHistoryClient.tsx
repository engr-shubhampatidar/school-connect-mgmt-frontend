"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import API from "@/services/axios";
import { ATTENDANCE_API } from "@/config/api-routes";
import {
  ensureSessionReady,
  getAccessToken,
  getActiveRole,
} from "@/modules/auth";
import {
  StudentInfoCard,
  AttendanceHistoryHeader,
  AttendanceDateFilter,
  AttendanceTable,
  EmptyState,
  StudentAttendanceHistorySkeleton,
  type AttendanceRecord,
} from "@/modules/attendance";

type AttendanceApiItem = {
  id: string;
  attendance?: {
    id?: string;
    date?: string;
    status?: string;
    [k: string]: unknown;
  };
  attendanceId?: string;
  studentId?: string;
  status?: string;
  createdAt?: string;
  [k: string]: unknown;
};

type ApiResponse = {
  studentId?: string;
  studentName?: string;
  class?: string;
  section?: string;
  attendance?: AttendanceApiItem[];
  [k: string]: unknown;
};

export default function StudentAttendanceHistoryClient({
  studentId,
}: {
  studentId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [student, setStudent] = useState<{
    id?: string | null;
    name?: string | null;
    className?: string | null;
    section?: string | null;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken() || getActiveRole() !== "teacher") {
      // Session missing — AuthBootstrap / proxy handle redirect
    }

    if (!studentId) {
      setError("Missing studentId");
      setLoading(false);
      return;
    }

    let mounted = true;
    async function load(date?: string | null) {
      setLoading(true);
      setError(null);
      try {
        await ensureSessionReady();
        if (!mounted) return;

        const res = await API.get(ATTENDANCE_API.STUDENT(studentId), {
          params: date ? { date } : undefined,
        });
        const data = res?.data as ApiResponse | AttendanceApiItem[] | null;

        // extract student metadata from top-level shape
        if (data && !Array.isArray(data)) {
          const top = data as ApiResponse;
          const s = {
            id: top.studentId ?? null,
            name: top.studentName ?? null,
            className: top.class ?? null,
            section: top.section ?? null,
          };
          if (mounted) setStudent(s);
        }

        // Extract records
        let recs: AttendanceApiItem[] = [];
        if (Array.isArray(data)) recs = data as AttendanceApiItem[];
        else if (data) recs = (data as ApiResponse).attendance ?? [];

        const normalized: AttendanceRecord[] = (recs ?? [])
          .map((r) => {
            const date = r.attendance?.date ?? r.createdAt ?? "";
            const status = r.status ?? (r.attendance?.status as string) ?? "";
            return {
              id: r.id,
              date,
              status,
              attendanceId: r.attendanceId,
              createdAt: r.createdAt,
            } as AttendanceRecord;
          })
          .filter((r) => Boolean(r.date))
          .sort(
            (a, b) =>
              new Date(String(b.date)).getTime() -
              new Date(String(a.date)).getTime(),
          );

        const final = date ? normalized : normalized.slice(0, 7);
        if (!mounted) return;
        setRecords(final);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load");
        setRecords([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load(selectedDate);
    return () => {
      mounted = false;
    };
  }, [studentId, selectedDate]);

  const studentMeta = useMemo(() => {
    if (student)
      return {
        id: student.id ?? undefined,
        name: student.name ?? undefined,
        className: student.className ?? undefined,
        section: student.section ?? undefined,
      };

    if (records.length > 0) {
      const r = records[0];
      return {
        id: r.id ?? undefined,
        name: undefined,
        className: undefined,
        section: undefined,
      };
    }
    return null;
  }, [student, records]);

  if (loading && !student && records.length === 0) {
    return <StudentAttendanceHistorySkeleton />;
  }

  return (
    <div className="p-4 space-y-4">
      <StudentInfoCard student={studentMeta} />

      <Card>
        <AttendanceHistoryHeader>
          <AttendanceDateFilter
            value={selectedDate ?? null}
            onChange={setSelectedDate}
          />
        </AttendanceHistoryHeader>
      </Card>

      <Card>
        {loading ? (
          <div className="animate-pulse space-y-3 p-2" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-200" />
            ))}
          </div>
        ) : error ? (
          <EmptyState message={error} />
        ) : records.length === 0 ? (
          <EmptyState
            message={
              selectedDate
                ? "No records for selected date."
                : "No recent records."
            }
          />
        ) : (
          <AttendanceTable records={records} />
        )}
      </Card>
    </div>
  );
}
