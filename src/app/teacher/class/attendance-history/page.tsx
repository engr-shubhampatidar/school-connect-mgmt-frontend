"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../../../components/ui/Card";
import {
  getTeacherClass,
  fetchAttendanceByClass,
} from "../../../../lib/teacherApi";
import { useToast } from "../../../../components/ui/use-toast";

type AttendanceRecord = {
  date: string;
  students?: Array<{ studentId?: string; status?: string }>;
  status?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AttendanceHistoryPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [klassId, setKlassId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const cls = await getTeacherClass();
        const maybeClass = (cls as Record<string, unknown>)?.class ?? cls;
        const mc = maybeClass as Record<string, unknown> | null | undefined;
        const id = mc ? mc["id"] ?? mc["classId"] ?? mc["id"] : undefined;
        if (!id) {
          if (!mounted) return;
          setKlassId(null);
          setRecords([]);
          setLoading(false);
          return;
        }
        if (!mounted) return;
        const idStr = String(id);
        setKlassId(idStr);

        const data = (await fetchAttendanceByClass(idStr)) as
          | AttendanceRecord[]
          | null;
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];

        // sort by date desc
        arr.sort((a, b) => {
          const da = new Date(a.date).getTime();
          const db = new Date(b.date).getTime();
          return db - da;
        });

        // default show latest 7 entries
        setRecords(arr.slice(0, 7));
      } catch (err: unknown) {
        let message = "Unable to load attendance";
        if (err instanceof Error) message = err.message;
        else if (typeof err === "object" && err !== null && "message" in err)
          message = String((err as { message?: unknown }).message ?? message);
        if (mounted) setError(message);
        toast({ title: "Error", description: message, type: "error" });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <div className="text-sm text-slate-600">
            Loading attendance history…
          </div>
        </Card>
      </div>
    );
  }

  if (!klassId) {
    return (
      <div className="p-4">
        <Card>
          <h3 className="text-lg font-medium">No class assigned</h3>
          <p className="text-sm text-slate-600">
            Attendance history is available only for class teachers.
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <h3 className="text-lg font-medium">Unable to load</h3>
          <p className="text-sm text-slate-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="p-4">
        <Card>
          <h3 className="text-lg font-medium">No attendance records</h3>
          <p className="text-sm text-slate-600">
            No attendance history available for this class.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <div>
          <h2 className="text-lg font-semibold">Attendance History</h2>
          <p className="text-sm text-slate-600">
            Showing latest {records.length} days
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        {records.map((r) => {
          const present = (r.students ?? []).filter(
            (s) => (s.status ?? "") === "PRESENT"
          ).length;
          const absent = (r.students ?? []).filter(
            (s) => (s.status ?? "") === "ABSENT"
          ).length;
          const isMarked = (r.status ?? "") === "MARKED";
          return (
            <Card key={r.date} className="p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {formatDate(r.date)}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="text-slate-500">Present</div>
                    <div className="font-semibold">{present}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-slate-500">Absent</div>
                    <div className="font-semibold">{absent}</div>
                  </div>
                </div>

                <div className="ml-4">
                  {isMarked ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-medium">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
