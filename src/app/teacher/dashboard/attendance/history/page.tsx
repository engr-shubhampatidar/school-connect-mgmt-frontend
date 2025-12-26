"use client";
import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../../../components/ui/Card";
import {
  getTeacherClass,
  fetchAttendanceByClass,
} from "../../../../../lib/teacherApi";
import ClassHeader from "./components/ClassHeader";
import AttendanceFilters from "./components/AttendanceFilters";
import AttendanceTable from "./components/AttendanceTable";

export default function AttendanceHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [klass, setKlass] = useState<Record<string, any> | null>(null);
  const [klassId, setKlassId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    let mounted = true;
    async function load(initial = true) {
      setLoading(true);
      setError(null);
      try {
        const cls = await getTeacherClass();
        const maybeClass = (cls as Record<string, unknown>)?.class ?? cls;
        const mc = maybeClass as Record<string, unknown> | null | undefined;
        const id = mc ? mc["id"] ?? mc["classId"] ?? mc["id"] : undefined;
        if (!id) {
          if (!mounted) return;
          setKlass(null);
          setKlassId(null);
          setRecords([]);
          setLoading(false);
          return;
        }
        const idStr = String(id);
        if (!mounted) return;
        setKlass(mc ?? null);
        setKlassId(idStr);

        // compute params for initial load (last 7 days) or selectedDate
        let params: { startDate?: string; endDate?: string } | undefined;
        if (initial) {
          const e = new Date();
          const s = new Date();
          s.setDate(e.getDate() - 6);
          params = {
            startDate: s.toISOString().slice(0, 10),
            endDate: e.toISOString().slice(0, 10),
          };
        } else if (selectedDate) {
          params = { startDate: selectedDate, endDate: selectedDate };
        }

        const data = (await fetchAttendanceByClass(idStr, params)) as
          | any[]
          | null;
        const arr = Array.isArray(data) ? data : [];
        arr.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (!mounted) return;
        setRecords(arr);
      } catch (err: unknown) {
        let message = "Unable to load attendance";
        if (err instanceof Error) message = err.message;
        if (mounted) setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load(true);
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  async function handleDateSelect(date: string | null) {
    setSelectedDate(date);
    if (!klassId) return;
    setLoading(true);
    setError(null);
    try {
      const params = date ? { startDate: date, endDate: date } : undefined;
      const data = (await fetchAttendanceByClass(klassId, params)) as
        | any[]
        | null;
      const arr = Array.isArray(data) ? data : [];
      arr.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecords(arr);
    } catch (err: unknown) {
      let message = "Unable to load attendance";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4 bg-slate-50 min-h-full">
      <ClassHeader klass={klass} />

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">Recent Records</div>
            <div className="text-sm text-slate-500">
              Last 7 days attendance summary
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Select Date and check History
            </div>
            <AttendanceFilters
              selected={selectedDate}
              onSelect={handleDateSelect}
              today={today}
            />
          </div>
        </div>

        <div className="mt-6">
          <AttendanceTable loading={loading} error={error} records={records} />
        </div>
      </Card>
    </div>
  );
}
