"use client";
import { Card } from "@/components/ui/Card";

export default function ClassDateHeader({
  name,
  section,
  date,
  maxDate,
  onDateChange,
}: {
  name?: string;
  section?: string | null;
  date: string;
  maxDate: string;
  onDateChange: (date: string) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
        <div>
          <p className="text-[12px] text-slate-600">Class &amp; Section</p>
          <h2 className="text-[24px] font-[600]">
            {name}
            {section ? ` -Section ${section}` : ""}
          </h2>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center justify-end">
            <p className="text-[10px] text-right  text-slate-400">
              {"Today's Attendance"}
            </p>
          </div>
          <input
            type="date"
            value={date}
            max={maxDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm"
          />
        </div>
      </div>
    </Card>
  );
}
