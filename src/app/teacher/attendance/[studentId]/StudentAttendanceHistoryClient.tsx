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

type AttendanceRecord = { date?: string; status?: string; [k: string]: any };

export default function StudentAttendanceHistoryClient({
  studentId,
}: {
  studentId?: string | null;
}) {
  const params = useParams();
  const effectiveStudentId = studentId ?? (params as any)?.studentId ?? null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [student, setStudent] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken("teacher")) {
      if (typeof window !== "undefined")
        window.location.href = "/teacher/login";
      return;
    }

    // Debug: studentId should be provided by route params
    // Log early to help diagnose undefined studentId during API calls
    // eslint-disable-next-line no-console
    console.log(
      "StudentAttendanceHistory: prop studentId=",
      studentId,
      "params studentId=",
      (params as any)?.studentId,
      "effective=",
      effectiveStudentId
    );

    if (!effectiveStudentId) {
      // avoid making API calls with undefined id
      setError("Missing studentId");
      setLoading(false);
      return;
    }

    let mounted = true;
    async function load(date?: string | null) {
      setLoading(true);
      setError(null);
      try {
        // eslint-disable-next-line no-console
        console.log("StudentAttendanceHistory: fetching", {
          studentId: effectiveStudentId,
          date,
        });
        const res = await TAPI.get(ATTENDANCE_API.STUDENT(effectiveStudentId), {
          params: date ? { date } : undefined,
        });
        const data = res?.data;

        // extract student metadata
        const s =
          data?.student ?? data?.studentInfo ?? data?.studentDetails ?? null;
        if (s && mounted) setStudent(s);

        // Extract records: support array-shaped or container object
        let recs: any[] = [];
        if (Array.isArray(data)) recs = data;
        else if (data) {
          recs =
            data.records ??
            data.attendance ??
            data.attendances ??
            data.history ??
            [];
        }

        // Normalize
        const normalized = (recs ?? [])
          .map((r: any) => ({
            date: r.date ?? r.createdAt ?? r.day ?? null,
            status: r.status ?? r.attendance ?? r.value ?? "",
            ...r,
          }))
          .filter((r: any) => r.date)
          .sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        // If no date selected, take last 7 days
        const final = date ? normalized : normalized.slice(0, 7);

        if (!mounted) return;
        setRecords(final);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Failed to load");
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
        id: student.id ?? student.studentId ?? student._id ?? null,
        name: student.name ?? student.fullName ?? null,
        rollNo: student.rollNo ?? student.roll_no ?? student.roll ?? null,
        className:
          student.className ?? student.class ?? student.classTitle ?? null,
        subject: student.subject ?? null,
      };
    // try to infer from records
    if (records.length > 0) {
      const r = records[0] as any;
      return {
        id: r.studentId ?? r.student?.id ?? r.id ?? null,
        name: r.student?.name ?? r.studentName ?? r.name ?? null,
        rollNo: r.rollNo ?? r.roll_no ?? null,
        className: r.className ?? r.class ?? null,
        subject: r.subject ?? null,
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
