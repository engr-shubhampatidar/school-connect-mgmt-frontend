"use client";

import { useParams } from "next/navigation";
import {
  StudentProfileDocuments,
  StudentProfileSkeleton,
  useStudentQuery,
  StudentProfileHeader,
  StudentPersonalInfoCard,
  StudentGuardianInfoCard,
  StudentAcademicInfoCard,
  StudentAttendanceCard,
  StudentProfileError,
} from "@/modules/students";

export default function StudentDetailsPage() {
  const params = useParams();
  const studentId =
    typeof params.studentId === "string" ? params.studentId : undefined;

  const { data: student, isLoading, isError, error, refetch } =
    useStudentQuery(studentId);

  if (isLoading) return <StudentProfileSkeleton />;

  if (isError || !student) {
    return (
      <StudentProfileError
        message={
          error instanceof Error
            ? error.message
            : "Failed to load student profile"
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="p-3 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {`About ${student.name || "Student"}`}
          </h1>
          <p className="mt-1 text-[13px] lg:text-[14px] text-[#737373]">
            Manage, Student Profiles, status and Enrollment
          </p>
        </div>
      </div>

      <StudentProfileHeader
        name={student.name}
        studentId={student.studentId}
        className={student.className}
        section={student.section}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
        <section className="flex flex-col gap-6 lg:col-span-2">
          <StudentPersonalInfoCard student={student} />
          <StudentGuardianInfoCard student={student} />
        </section>
        <section className="flex flex-col gap-6">
          <StudentAcademicInfoCard student={student} />
          <StudentAttendanceCard attendance={student.attendance} />
        </section>
      </div>

      {studentId ? <StudentProfileDocuments studentId={studentId} /> : null}

      <div className="flex w-full p-3 md:p-6">
        <p className="text-[10px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the accounts
          department for assistance.
        </p>
      </div>
    </div>
  );
}
