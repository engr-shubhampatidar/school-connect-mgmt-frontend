type DashboardHeaderProps = {
  teacherName: string;
  todayLabel: string;
  classLabel: string | null;
};

export default function DashboardHeader({
  teacherName,
  todayLabel,
  classLabel,
}: DashboardHeaderProps) {
  return (
    <section className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <h3 className="text-[24px] text-[#021034] font-[600]">
            Welcome back, {teacherName}!
          </h3>
          <div className="flex gap-2 flex-wrap">
            <p className="text-[14px] text-[#737373] font-[400]">
              {todayLabel}
              {classLabel ? " ." : ""}
            </p>
            {classLabel && (
              <p className="text-[14px] text-[#16A34A] font-[400]">
                You are the class teacher of {classLabel}
              </p>
            )}
          </div>
        </div>
        <div className="text-sm text-slate-500">&nbsp;</div>
      </div>
    </section>
  );
}
