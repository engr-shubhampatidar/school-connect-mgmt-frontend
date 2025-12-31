"use client";
import ClassSummaryCard from "./Components/ClassSummaryCard";
import AttendanceTodayCard from "./Components/AttendanceTodayCard";
import StudentListCard, { Student } from "./Components/StudentListCard";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../../lib/auth";
import { useToast } from "../../../components/ui/use-toast";
import { getTeacherClass, type TeacherClass } from "../../../lib/teacherApi";

/**
 * Teacher My Class page
 * - Loads teacher and class data
 * - Extracts students and passes them to StudentListCard
 */
function page() {
  const router = useRouter();
  const { toast } = useToast();

  // Local UI state
  const [klass, setKlass] = useState<TeacherClass | null>(null);

  // Students list matches the `Student` shape exported from StudentListCard
  const [students, setStudents] = useState<Student[]>([]);

  // Keep a stable ref to toast so async callbacks can invoke it safely
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!getToken("teacher")) {
      router.push("/teacher/login");
      return;
    }

    let mounted = true;

    async function load() {
      try {
        // getTeacherClass may return either { class, students } or the class directly
        const raw = await getTeacherClass().catch(() => null);
        if (!mounted || !raw) return;

        if (typeof raw === "object") {
          const r = raw as Record<string, unknown>;
          if ("class" in r) {
            const parsed = raw as {
              class?: TeacherClass;
              students?: Student[];
            };
            setKlass(parsed.class ?? null);
            setStudents(parsed.students ?? []);
          } else {
            // Legacy: response itself is a class and may include `students`
            const parsed = raw as TeacherClass & { students?: Student[] };
            setKlass(parsed);
            setStudents(parsed.students ?? []);
          }
        }
      } catch (err: unknown) {
        let message = "Unable to load data";
        if (typeof err === "object" && err !== null && "message" in err) {
          const maybeMessage = (err as unknown as { message?: unknown })
            .message;
          if (typeof maybeMessage === "string") message = maybeMessage;
        }
        toastRef.current?.({
          title: "Unable to load",
          description: message,
          type: "error",
        });
      } finally {
        // intentionally left blank; no local loading state used
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
          <div className="min-w-2/3 ">
            <ClassSummaryCard
              className={klass?.name ?? "-"}
              section={klass?.section ?? "-"}
              location="Second Floor, Room 204"
              academicYear="Academic Year 2025-26"
              totalStudents={students.length}
              showAlert
            />
          </div>
          <AttendanceTodayCard
            total={students.length}
            present={30}
            absent={2}
            leave={2}
          />
        </div>
        <StudentListCard students={students} />
      </div>
    </>
  );
}

export default page;
