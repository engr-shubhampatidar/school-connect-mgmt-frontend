import { CheckCircle } from "lucide-react";

type ScheduleItem = {
  time: string;
  title: string;
  subtitle: string;
  status?: "completed" | "current" | "upcoming";
};

type TodayScheduleCardProps = {
  dayLabel?: string;
  schedules: ScheduleItem[];
  onViewWeek?: () => void;
};

export default function TodayScheduleCard({
  dayLabel = "Tuesday",
  schedules,
  onViewWeek,
}: TodayScheduleCardProps) {
  return (
    <div className="w-full max-w-[600px] rounded-xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Today’s Schedule
        </h2>

        <span className="rounded-lg border px-3 py-1.5 text-sm text-slate-600">
          {dayLabel}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-1 rounded-lg border">
        {schedules.map((item, index) => {
          const isCurrent = item.status === "current";
          const isCompleted = item.status === "completed";

          return (
            <div
              key={index}
              className={`relative flex gap-4 border-b p-4 last:border-none
                ${isCurrent ? "bg-blue-100" : "bg-white"}
              `}
            >
              {/* Time */}
              <div className="w-20 text-sm text-slate-500">{item.time}</div>

              {/* Timeline Indicator */}
              <div className="relative flex flex-col items-center">
                <span className="h-full w-px bg-slate-300" />
                <span className="absolute top-2 h-2 w-2 rounded-full bg-slate-600" />
              </div>

              {/* Content */}
              <div className="flex flex-1 items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </div>

                {/* Status */}
                {isCompleted && (
                  <CheckCircle size={18} className="text-green-600" />
                )}

                {isCurrent && (
                  <span className="rounded-md bg-white px-3 py-1 text-xs font-medium text-blue-600">
                    Now
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button
        onClick={onViewWeek}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        + View Full Week
      </button>
    </div>
  );
}
