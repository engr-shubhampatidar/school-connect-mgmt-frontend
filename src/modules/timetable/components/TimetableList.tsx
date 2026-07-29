import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Badge from "@/components/ui/Badge";
import { Clock, Check } from "lucide-react";
import type { ClassTimetableEntry } from "@/modules/timetable/types/timetable";

export type { ClassTimetableEntry };

interface Props {
  items: ClassTimetableEntry[];
  isLoading: boolean;
  selectedDay?: number;
}

function parseTimeToDate(time: string, base = new Date()) {
  const [hh, mm, ss] = time.split(":").map((s) => parseInt(s, 10));
  const d = new Date(base);
  d.setHours(hh, mm, ss ?? 0, 0);
  return d;
}

function formatTime(time: string) {
  const [hhS, mmS] = time.split(":");
  const hh = parseInt(hhS, 10);
  const mm = parseInt(mmS, 10);
  const period = hh >= 12 ? "PM" : "AM";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${hour12}:${mm.toString().padStart(2, "0")} ${period}`;
}

export default function TimetableList({
  items,
  isLoading,
  selectedDay,
}: Props) {
  const today = new Date();
  const defaultDay =
    typeof selectedDay === "number" ? selectedDay : today.getDay();

  const filtered = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [items]);

  const now = new Date();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-auto" />

        {[1, 2, 3].map((r) => (
          <div key={r} className="flex items-start gap-4">
            <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-auto" />

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500">
          No timetable entries for this day
        </div>
      ) : (
        <div className="space-y-3">
          <Table className="p-0">
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const start = parseTimeToDate(t.startTime, now);
                const end = parseTimeToDate(t.endTime, now);
                const isNow =
                  now >= start && now <= end && now.getDay() === defaultDay;
                const isCompleted = now > end && now.getDay() === defaultDay;

                return (
                  <TableRow key={t.id}>
                    <TableCell className="w-40 text-sm font-semibold">
                      {formatTime(t.startTime)} - {formatTime(t.endTime)}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      {t.subjectName}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 ml-4">
                      {t.teacherName ?? ""}
                    </TableCell>
                    <TableCell className="mt-1 text-sm text-slate-500">
                      Room No. {t.room ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {isNow ? (
                        <Badge variant="outline">
                          <Clock size={14} className="inline-block mr-1" /> Now
                        </Badge>
                      ) : isCompleted ? (
                        <Badge variant="success">
                          <Check size={14} className="inline-block mr-1" />{" "}
                          Completed
                        </Badge>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
