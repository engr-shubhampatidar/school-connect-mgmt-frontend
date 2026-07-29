"use client";
import ClassSummaryCard from "./components/ClassSummaryCard";
import AttendanceTodayCard from "./components/AttendanceTodayCard";
import StudentListCard, { Student } from "./components/StudentListCard";
import { useCallback } from "react";
import { useAuthenticatedLoad } from "@/hooks/useAuthenticatedLoad";
import {
  getTeacherClass,
  MyClassPageSkeleton,
  type ClassAttendanceSummary,
  type TeacherClass,
  type TeacherClassStudent,
} from "@/modules/teachers";

function mapToStudent(s: TeacherClassStudent): Student {
  const statusRaw = (s.status ?? "Active").toString();
  const status: Student["status"] =
    statusRaw.toLowerCase() === "inactive" ? "Inactive" : "Active";

  return {
    studentId: s.studentId,
    name: s.name ?? "",
    email: s.email ?? "",
    gender: s.gender ?? "",
    status,
  };
}

type MyClassData = {
  klass: TeacherClass | null;
  students: Student[];
  attendanceTaken: boolean;
  attendanceSummary: ClassAttendanceSummary | null;
};

/**
 * Teacher My Class page
 * - Loads teacher and class data
 * - Extracts students and passes them to StudentListCard
 */
function Page() {
  const load = useCallback(async (): Promise<MyClassData> => {
    const {
      class: classData,
      students: classStudents,
      attendanceTaken: taken,
      attendanceSummary: summary,
    } = await getTeacherClass();

    return {
      klass: classData ?? null,
      students: (classStudents ?? []).map(mapToStudent),
      attendanceTaken: Boolean(taken),
      attendanceSummary: summary ?? null,
    };
  }, []);

  const { data, loading } = useAuthenticatedLoad("teacher", load, {
    errorTitle: "Unable to load",
  });

  const klass = data?.klass ?? null;
  const students = data?.students ?? [];
  const attendanceTaken = data?.attendanceTaken ?? false;
  const attendanceSummary = data?.attendanceSummary ?? null;

  if (loading) {
    return <MyClassPageSkeleton />;
  }

  return (
    <>
      <div className="p-6 gap-6 flex flex-col">
        <div className="flex flex-row gap-6">
          <div className={attendanceTaken ? "min-w-2/3" : "w-full"}>
            <ClassSummaryCard
              className={klass?.name ?? "-"}
              section={klass?.section ?? "-"}
              location="Second Floor, Room 204"
              academicYear="Academic Year 2025-26"
              totalStudents={students.length}
              showAlert={!attendanceTaken}
              attendanceTaken={attendanceTaken}
            />
          </div>
          {attendanceTaken && attendanceSummary && (
            <AttendanceTodayCard
              total={attendanceSummary.total}
              present={attendanceSummary.present}
              absent={attendanceSummary.absent}
              leave={attendanceSummary.late}
            />
          )}
        </div>
        <StudentListCard students={students} />
      </div>
    </>
  );
}

export default Page;
