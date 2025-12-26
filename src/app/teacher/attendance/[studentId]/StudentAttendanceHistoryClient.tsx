"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "../../../../components/ui/Card";
import TAPI from "../../../../lib/teacherApi";
import { ATTENDANCE_API } from "../../../../lib/api-routes";
import { getToken } from "../../../../lib/auth";
import StudentInfoCard from "../../../../components/attendance/StudentInfoCard";
import AttendanceHistoryHeader from "../../../../components/attendance/AttendanceHistoryHeader";
import AttendanceDateFilter from "../../../../components/attendance/AttendanceDateFilter";
import AttendanceTable from "../../../../components/attendance/AttendanceTable";
import LoadingState from "../../../../components/attendance/LoadingState";
import EmptyState from "../../../../components/attendance/EmptyState";

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

type AttendanceRecord = {
  id?: string;
  date: string;
  status: string;
  attendanceId?: string;
  createdAt?: string;
  [k: string]: unknown;
};

export default function StudentAttendanceHistoryClient({
  studentId,
}: {
  studentId?: string | null;
}) {
  const params = useParams() as { studentId?: string };
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
    if (!getToken("teacher")) {
      if (typeof window !== "undefined")
        window.location.href = "/teacher/login";
      return;
    }

    const effectiveStudentId = studentId ?? params?.studentId ?? null;

    if (!effectiveStudentId) {
      setError("Missing studentId");
      setLoading(false);
      return;
    }

    let mounted = true;
    async function load(date?: string | null) {
      setLoading(true);
      setError(null);
      try {
        const res = await TAPI.get(ATTENDANCE_API.STUDENT(effectiveStudentId), {
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
          .filter((r) => r.date)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
  }, [studentId, selectedDate, params]);

  const studentMeta = useMemo(() => {
    if (student)
      return {
        id: student.id ?? null,
        name: student.name ?? null,
        className: student.className ?? null,
        section: student.section ?? null,
      };

    if (records.length > 0) {
      const r = records[0];
      return {
        id: r.id ?? null,
        name: null,
        className: null,
        section: null,
      };
    }
    return null;
  }, [student, records]);

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
          <LoadingState />
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
