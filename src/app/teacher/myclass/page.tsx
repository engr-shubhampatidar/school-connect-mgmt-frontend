"use client";
import ClassSummaryCard from "./Components/ClassSummaryCard";
import AttendanceTodayCard from "./Components/AttendanceTodayCard";
import StudentListCard, { Student } from "./Components/StudentListCard";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureSessionReady, getAccessToken, getActiveRole } from "../../../lib/auth";
import { useToast } from "../../../components/ui/use-toast";
import {
  getTeacherClass,
  type ClassAttendanceSummary,
  type TeacherClass,
  type TeacherClassStudent,
} from "../../../lib/teacherApi";

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

/**
 * Teacher My Class page
 * - Loads teacher and class data
 * - Extracts students and passes them to StudentListCard
 */
function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const [klass, setKlass] = useState<TeacherClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceTaken, setAttendanceTaken] = useState(false);
  const [attendanceSummary, setAttendanceSummary] =
    useState<ClassAttendanceSummary | null>(null);

  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      await ensureSessionReady();
      if (!mounted) return;
      if (!getAccessToken() || getActiveRole() !== "teacher") {
        return;
      }
      try {
        const {
          class: classData,
          students: classStudents,
          attendanceTaken: taken,
          attendanceSummary: summary,
        } = await getTeacherClass();
        if (!mounted) return;

        setKlass(classData ?? null);
        setStudents((classStudents ?? []).map(mapToStudent));
        setAttendanceTaken(Boolean(taken));
        setAttendanceSummary(summary ?? null);
      } catch (err: unknown) {
        let message = "Unable to load data";
        if (typeof err === "object" && err !== null && "message" in err) {
          const maybeMessage = (err as { message?: unknown }).message;
          if (typeof maybeMessage === "string") message = maybeMessage;
        }
        toastRef.current?.({
          title: "Unable to load",
          description: message,
          type: "error",
        });
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

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
