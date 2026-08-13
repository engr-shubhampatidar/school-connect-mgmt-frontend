"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import {
  getTimetable,
  type StudentTimetableItem,
} from "@/modules/students";
import { ensureSessionReady } from "@/modules/auth";
import { useToast } from "@/components/ui/use-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { DataTableSkeleton } from "@/components/skeletons";

const DAY_LABELS: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
  0: "Sunday",
};

function teacherName(item: StudentTimetableItem): string {
  return (
    item.subjectTeacher ?? item.teacher ?? item.teacherName ?? "—"
  );
}

export default function StudentTimetablePage() {
  const [items, setItems] = React.useState<StudentTimetableItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const toastRef = React.useRef(toast);

  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ensureSessionReady();
      const data = await getTimetable();
      setItems(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load timetable";
      setError(message);
      toastRef.current?.({
        title: "Error",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const hasDay = items.some(
    (i) => typeof i.dayOfWeek === "number" && Number.isFinite(i.dayOfWeek),
  );

  const grouped = React.useMemo(() => {
    if (!hasDay) return null;
    const map = new Map<number, StudentTimetableItem[]>();
    for (const item of items) {
      const day = typeof item.dayOfWeek === "number" ? item.dayOfWeek : -1;
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(item);
    }
    return [...map.entries()].sort(([a], [b]) => a - b);
  }, [items, hasDay]);

  if (loading) {
    return (
      <div className="mx-auto px-4 py-6">
        <div className="mb-6 space-y-2">
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>
        <DataTableSkeleton
          rows={8}
          columns={[
            { headerWidth: "w-24", cellWidth: "w-28" },
            { headerWidth: "w-32", cellWidth: "w-40" },
            { headerWidth: "w-28", cellWidth: "w-32" },
            { headerWidth: "w-20", cellWidth: "w-24" },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6 bg-[#F5F9FF] min-h-full">
      <div className="mb-6 flex items-start gap-3">
        <CalendarDays className="mt-1 h-5 w-5 text-[#021034]" />
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Timetable</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Your weekly class schedule
          </p>
        </div>
      </div>

      {error ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-700">{error}</p>
            <Button variant="dark" onClick={() => void load()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-500">
            No timetable entries yet. Check back once your class schedule is
            published.
          </p>
        </Card>
      ) : grouped ? (
        <div className="space-y-4">
          {grouped.map(([day, rows]) => (
            <Card key={day}>
              <h2 className="mb-3 text-base font-semibold text-[#021034]">
                {DAY_LABELS[day] ?? `Day ${day}`}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2 pr-3">Time</th>
                      <th className="py-2 pr-3">Subject</th>
                      <th className="hidden py-2 pr-3 md:table-cell">Teacher</th>
                      <th className="py-2">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr
                        key={`${day}-${row.subject}-${row.startTime}-${idx}`}
                        className="border-t border-slate-100"
                      >
                        <td className="py-3 pr-3 whitespace-nowrap text-[#021034]">
                          {row.startTime ?? "—"}
                          {row.endTime ? `–${row.endTime}` : ""}
                        </td>
                        <td className="py-3 pr-3 font-medium text-[#021034]">
                          {row.subject ?? "—"}
                        </td>
                        <td className="hidden py-3 pr-3 md:table-cell text-slate-600">
                          {teacherName(row)}
                        </td>
                        <td className="py-3 text-slate-600">{row.room ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Subject</th>
                  <th className="hidden py-2 pr-3 md:table-cell">Teacher</th>
                  <th className="py-2">Room</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr
                    key={`${row.subject}-${row.startTime}-${idx}`}
                    className="border-t border-slate-100"
                  >
                    <td className="py-3 pr-3 whitespace-nowrap text-[#021034]">
                      {row.startTime ?? "—"}
                      {row.endTime ? `–${row.endTime}` : ""}
                    </td>
                    <td className="py-3 pr-3 font-medium text-[#021034]">
                      {row.subject ?? "—"}
                    </td>
                    <td className="hidden py-3 pr-3 md:table-cell text-slate-600">
                      {teacherName(row)}
                    </td>
                    <td className="py-3 text-slate-600">{row.room ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
