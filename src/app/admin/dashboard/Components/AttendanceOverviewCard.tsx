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

  return (
    <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex gap-2">
          <select className="rounded-md border px-3 py-1.5 text-sm text-slate-600">
            <option>All class</option>
          </select>
          <select className="rounded-md border px-3 py-1.5 text-sm text-slate-600">
            <option>Monthly</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 flex items-end justify-between gap-6">
        {data.map((item) => (
          <div key={item.month} className="flex flex-col items-center gap-2">
            <div className="relative h-40 w-14 rounded-md bg-slate-100">
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
