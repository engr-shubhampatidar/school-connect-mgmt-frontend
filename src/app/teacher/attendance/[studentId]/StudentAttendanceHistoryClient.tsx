"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../../../components/ui/Card";
import TAPI from "../../../../lib/teacherApi";
import { ATTENDANCE_API } from "../../../../lib/api-routes";
import { getToken } from "../../../../lib/auth";

type AttendanceRecord = {
  date?: string;
  status?: string;
  [k: string]: any;
};

export default function StudentAttendanceHistoryClient({
  studentId,
}: {
  studentId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!getToken("teacher")) {
      if (typeof window !== "undefined") window.location.href = "/teacher/login";
      return;
    }

    let mounted = true;
    async function load() {
      try {
        const res = await TAPI.get(ATTENDANCE_API.STUDENT(studentId));
        const data = res?.data;

        let recs: AttendanceRecord[] = [];
        let name: string | null = null;

        if (Array.isArray(data)) {
          recs = data as AttendanceRecord[];
        } else if (data && typeof data === "object") {
          // common shapes
          recs =
            data.records ?? data.attendance ?? data.attendances ?? data.history ?? data.rows ?? [];
          if (!Array.isArray(recs) && typeof data === "object") {
            // fallback: treat top-level object as single-record container
            recs = Array.isArray(data) ? data : [];
          }
          name = data.student?.name ?? data.name ?? null;
        }

        // Try to extract name from records if still missing
        if (!name && recs.length > 0) {
          const first = recs[0] as any;
          name = first.student?.name ?? first.studentName ?? first.name ?? null;
        }

        // Normalize and sort by date desc
        const normalized = recs
          .map((r) => ({
            date: r.date ?? r.createdAt ?? r.day ?? null,
            status: r.status ?? r.attendance ?? r.value ?? "",
            ...r,
          }))
          .filter((r) => r.date)
          .sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime())
          .slice(0, 10);

        if (!mounted) return;
        setStudentName(name);
        setRecords(normalized);
      } catch (err) {
        // silently show empty state
        setRecords([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [studentId]);

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 space-y-4">
      <Card>
        <div>
          <h2 className="text-lg font-semibold">
            {studentName ?? "Student"} — Attendance History
          </h2>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-slate-600">
                    No recent records
                  </td>
                </tr>
              )}
              {records.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">
                    {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2">{r.status ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
