"use client";

import * as React from "react";
import { PieChart, Pie, Label } from "recharts";

type AttendanceSummaryProps = {
  presentDays: number;
  absentDays: number;
  monthlyPercentage: number;
};

export default function AttendanceSummary({
  presentDays,
  absentDays,
  monthlyPercentage,
}: AttendanceSummaryProps) {
  const total = presentDays + absentDays;
  const percentage = ((presentDays / total) * 100).toFixed(1);

  const data = [
    { name: "Present", value: presentDays, fill: "#2ca02c" },
    { name: "Absent", value: absentDays, fill: "#d62728" },
  ];

  return (
    <div className="w-full rounded-xl border border-[#D7E3FC] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E3FC]">
        <h2 className="text-lg font-semibold text-[#021034]">
          Attendance Summary
        </h2>
        <span className="text-[#737373]">📅</span>
      </div>

      {/* Chart */}
      <div className="flex justify-center py-6">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={100}
            strokeWidth={0}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox) return null;
                let cx: number;
                let cy: number;

                if ("cx" in viewBox && "cy" in viewBox) {
                  cx = viewBox.cx;
                  cy = viewBox.cy;
                } else {
                  cx = viewBox.x + viewBox.width / 2;
                  cy = viewBox.y + viewBox.height / 2;
                }
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan className="text-3xl font-bold fill-[#021034]">
                      {percentage}%
                    </tspan>
                    <tspan x={cx} dy={24} className="text-sm fill-gray-500">
                      Attendance
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </div>

      {/* Legend */}
      <div className="px-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            <span>Present</span>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-[#021034] border border-[#D7E3FC]">
            {presentDays} Days
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span>Absent</span>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-[#021034]">
            {absentDays} Days
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 space-y-3">
        <div className="rounded-md bg-blue-100 py-2 text-center text-sm font-semibold text-[#021034]">
          This Month : {monthlyPercentage}%
        </div>

        <button className="w-full rounded-md border border-[#D7E3FC] py-2 text-sm font-medium text-[#021034] hover:bg-blue-50 transition">
          View Full Attendance
        </button>
      </div>
    </div>
  );
}
