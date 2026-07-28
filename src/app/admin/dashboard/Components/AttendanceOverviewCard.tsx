"use client";

import React, { useState } from "react";
import { fetchClasses } from "@/lib/adminApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui";
import { Card } from "@/components/ui";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  // CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ADMIN_API } from "@/lib/api-routes";
import API from "@/lib/axios";

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
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([{ id: "all", name: "All class" }]);
  const periodOptions = [{ id: "monthly", name: "Monthly" }];

  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    periodOptions[0].id,
  );
  const [chartData, setChartData] = useState<AttendanceData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayedData = chartData ?? data;
  const computedMax = displayedData.length
    ? Math.max(...displayedData.map((d) => d.value))
    : 0;

  React.useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const payload: Record<string, unknown> =
          selectedClass === "all"
            ? { type: "ALL" }
            : { type: "CLASS", classId: selectedClass };
        // include selected period so backend can return appropriate aggregation
        payload.period = selectedPeriod;

        const res = await API.post(ADMIN_API.GRAPH, payload);
        // Response may be an array of { month, value } OR an object like
        // { "Jan": 67, "Dec": 83, ... }. Normalize both shapes to
        // AttendanceData[] in month order.
        if (!mounted) return;

        const dataRes = res.data;
        if (Array.isArray(dataRes)) {
          setChartData(dataRes as AttendanceData[]);
        } else if (dataRes && typeof dataRes === "object") {
          const monthOrder = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const normalized: AttendanceData[] = monthOrder.map((m) => ({
            month: m,
            value: Number((dataRes as Record<string, unknown>)[m] ?? 0),
          }));

          setChartData(normalized);
        }
      } catch (err: unknown) {
        setError("Failed to load attendance data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [selectedClass, selectedPeriod]);

  // load classes once on mount
  React.useEffect(() => {
    let mounted = true;
    (async function loadClasses() {
      try {
        const res = await fetchClasses();
        if (!mounted) return;
        const opts = [
          { id: "all", name: "All class" },
          ...res.classes.map((c) => ({
            id: c.id ?? c.name,
            name: c.section ? `${c.name} - ${c.section}` : c.name,
          })),
        ];
        setClassOptions(opts);
      } catch (e) {
        // ignore; keep default option
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card className="w-full">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[24px] font-[600] text-[#021034]">{title}</h2>
          <p className="text-[14px] text-[#737373]">{subtitle}</p>
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

          <Select
            disabled
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
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

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className=" h-56 mt-12 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayedData.map((d) => ({
              month: d.month,
              attendance: d.value,
            }))}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            {/* <CartesianGrid vertical={false} strokeDasharray="3 3" /> */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <YAxis hide domain={[0, computedMax || 1]} />
            <Tooltip
              formatter={(value?: number) => [value ?? 0, "Attendance"]}
              cursor={{ fill: "transparent" }}
            />
            <Bar dataKey="attendance" fill="#051643" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <div className="text-sm text-slate-700">Loading...</div>
          </div>
        )}
      </div>
    </Card>
  );
}
