"use client";

import StatCard from "@/components/admin/StatCard";
import { Users, ClipboardCheck, MailQuestionMark } from "lucide-react";

type DashboardStatsProps = {
  totalStudents: number;
  attendanceDone: boolean;
  nextClass: string;
};

export default function DashboardStats({
  totalStudents,
  attendanceDone,
  nextClass,
}: DashboardStatsProps) {
  return (
    <div className="flex w-full grid-cols-1 md:grid-cols-4 gap-[20px] mb-[20px] grid">
      <StatCard
        label="Total Students"
        progressLabel="+180 Last Month"
        value={totalStudents}
        className="bg-[#FFFFFF] border-[#D7E3FC]"
        icon={Users}
        iconBgColor="bg-[#D3FFF1]"
      />
      <StatCard
        label="Attendance"
        value={attendanceDone ? "Completed" : "Pending"}
        className="bg-[#FFFFFF] border-[#D7E3FC]"
        icon={ClipboardCheck}
        progressLabel="+180 Last Month"
        iconBgColor="bg-[#F9EAD0]"
      />
      <StatCard
        label="Pending Marks"
        value="02"
        className="bg-[#FFFFFF] border-[#D7E3FC]"
        icon={MailQuestionMark}
        progressLabel="+180 Last Month"
        iconBgColor="bg-[#CCDEFF]"
      />
      <StatCard
        label="Next Class"
        value={nextClass}
        className="bg-[#FFFFFF] border-[#D7E3FC]"
        icon={Users}
        progressLabel="+180 Last Month"
        iconBgColor="bg-[#E4D8FF]"
      />
    </div>
  );
}
