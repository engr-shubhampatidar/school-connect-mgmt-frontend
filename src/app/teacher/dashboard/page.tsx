"use client";
import { useRouter } from "next/navigation";
import { AssignedSubjectsCard } from "@/modules/teachers";
import {
  useTeacherDashboard,
  TodayScheduleCard,
  DashboardHeader,
  DashboardStats,
  MyClassCard,
  TeacherDashboardSkeleton,
} from "@/modules/dashboard";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const {
    loading,
    teacherName,
    todayLabel,
    dayLabel,
    hasClass,
    classLabel,
    room,
    totalStudents,
    attendanceDone,
    nextClass,
    subjects,
    schedules,
  } = useTeacherDashboard();

  if (loading) {
    return <TeacherDashboardSkeleton />;
  }

  return (
    <div className="p-4 space-y-4">
      <DashboardHeader
        teacherName={teacherName}
        todayLabel={todayLabel}
        classLabel={classLabel}
      />

      <DashboardStats
        totalStudents={totalStudents}
        attendanceDone={attendanceDone}
        nextClass={nextClass}
      />

      <div className="flex flex-row gap-4">
        <section className="w-2/3 gap-4 mb-4 flex flex-col">
          <MyClassCard
            hasClass={hasClass}
            classLabel={classLabel}
            room={room}
            totalStudents={totalStudents}
            attendanceDone={attendanceDone}
            onTakeAttendance={() => router.push("/teacher/attendance")}
          />

          <AssignedSubjectsCard
            subjects={subjects}
            onViewStudents={(item) => console.log("View", item)}
            onEnterMarks={(item) => console.log("Enter marks", item)}
            onExport={() => console.log("Export report")}
          />
        </section>

        <TodayScheduleCard
          dayLabel={dayLabel}
          schedules={schedules}
          onViewWeek={() => console.log("View full week")}
        />
      </div>
    </div>
  );
}
