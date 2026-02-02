import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";

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
    <div className="w-full h-fit max-w-[600px] rounded-[8px] border border-[#D7E3FC] bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[24px] font-[600] text-[#020617]">
          Today’s Schedule
        </h2>

        <span className="rounded-[8px] border px-[8px] py-[4px] text-[14px] font-[500]  text-[#020617]">
          {dayLabel}
        </span>
      </div>

      {/* Timeline */}
      <div className="rounded-[8px] border  ">
        {schedules.map((item, index) => {
          const isCurrent = item.status === "current";
          const isCompleted = item.status === "completed";

          return (
            <div
              key={index}
              className={`relative flex  gap-4  p-[16px]  
                ${isCurrent ? "bg-blue-100" : "bg-white rounded-[8px]"}
              `}
            >
              {/* Time */}
              <div className={`w-20 text-[14px] font-[600] text-[#737373]  `}>{item.time}</div>

              {/* Timeline Indicator */}
              <div className="relative flex flex-col items-center">
                <span className="h-full w-px bg-slate-300" />
                <span className="absolute top-2 h-2 w-2 rounded-full bg-slate-600" />
              </div>

              {/* Content */}
              <div className="flex flex-1 items-start justify-between">
                <div>
                  <p className={`text-[14px] font-[600] text-[#020617] ${item.status === "completed" ? "line-through" : ""} `}>
                    {item.title}
                  </p>
                  <p className="text-[14px] font-[400] text-[#737373]">{item.subtitle}</p>
                </div>
                {/* Status */}
                {isCompleted && (
                  <CheckCircle size={18} className="text-green-600" />
                )}

                {isCurrent && (
                  <span className="rounded-md bg-white px-[8px] py-[4px] text-[14px] font-[500] text-[#051643]">
                    Now
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex w-full justify-center pt-4">
        <Button onClick={onViewWeek} variant="dark" className="w-full">
          + View Full Week
        </Button>
      </div>
    </div>
  );
}
