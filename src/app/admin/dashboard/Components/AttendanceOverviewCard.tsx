"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui";

type AttendanceData = {
  month: string;
  value: number; // relative height
};

type AttendanceOverviewCardProps = {
  title?: string;
  subtitle?: string;
  data: AttendanceData[];
};

export default function AttendanceOverviewCard({
  title = "Attendance Overview",
  subtitle = "Daily attendance metrics for the months",
  data,
}: AttendanceOverviewCardProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const classOptions = [{ id: "all", name: "All class" }];
  const periodOptions = [{ id: "monthly", name: "Monthly" }];

  const [selectedClass, setSelectedClass] = useState<string>(
    classOptions[0].id
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    periodOptions[0].id
  );

  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="rounded-md border px-3 py-1.5 text-sm text-slate-600">
              <SelectValue placeholder="All class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {classOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="rounded-md border px-3 py-1.5 text-sm text-slate-600">
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {periodOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 flex items-end justify-between gap-6">
        {data.map((item) => (
          <div key={item.month} className="flex flex-col items-center gap-2">
            <div className="relative h-40 w-14 rounded-md">
              <div
                className="absolute bottom-0 w-full rounded-md bg-slate-900"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm text-slate-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
