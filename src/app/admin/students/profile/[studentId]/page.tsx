"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getStudentById,
  type StudentDetails,
  StudentProfileDocuments,
  StudentProfileSkeleton,
} from "@/modules/students";
import {
  formatAadharDisplay,
  formatDisplayDate,
  formatLabel,
  formatMobileDisplay,
} from "@/modules/students/utils/formatters";
import Image from "next/image";
import { Card } from "@/components/ui";
import { CalendarCheck } from "lucide-react";

function classSectionLabel(student: StudentDetails | null) {
  if (!student?.className) return "Not Assigned";
  return student.section
    ? `${student.className} - ${student.section}`
    : student.className;
}

function displayMobile(value?: string | null) {
  if (!value) return "-";
  return formatMobileDisplay(value) || "-";
}

function displayAadhaar(value?: string | null) {
  if (!value) return "-";
  return formatAadharDisplay(value) || "-";
}

export default function StudentDetailsPage() {
  const { studentId } = useParams();

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await getStudentById(studentId as string);
        setStudent(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [studentId]);

  if (loading) return <StudentProfileSkeleton />;

  const attendance = student?.attendance;
  const attendancePct = attendance?.percentage ?? 0;

  return (
    <div className="p-3 md:p-6 ">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {`About ${student?.name ? student.name : "Student"}`}
          </h1>
          <p className="mt-1 text-[13px] lg:text-[14px] text-[#737373]">
            Manage, Student Profiles, status and Enrollment
          </p>
        </div>
      </div>
      <Card className="flex items-center gap-6 mb-[20px]">
        <div className="bg-slate-400 rounded-full overflow-hidden w-[62px] h-[62px] items-center flex-shrink-0">
          <Image
            src={"/images/avatar.png"}
            alt="avatar"
            width={62}
            height={62}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 gap-2 flex flex-col">
          <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {student?.name ?? "-"}
          </div>
          <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
            Student ID:{" "}
            <span className="text-[#021034]">{student?.studentId ?? "-"}</span>
          </div>
          <div className="flex gap-2">
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
              {classSectionLabel(student)}
            </p>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-[20px]">
        <section className=" flex flex-col gap-6 col-span-2">
          <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
            <h2 className="text-[16px] lg:text-[20px] font-semibold text-gray-900 mb-5">
              Personal Information
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Full Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.name ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Date of Birth
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {formatDisplayDate(student?.dob)}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">Gender</p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {formatLabel(student?.gender)}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Blood Group
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.bloodGroup ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Aadhaar Number
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {displayAadhaar(student?.aadhaarNumber)}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Phone No.
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {displayMobile(student?.phoneNo)}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Email Address
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.email ?? "-"}
                </p>
              </div>

              <div className="col-span-2 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">Address</p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.address ?? "-"}
                </p>
              </div>

              <div className="col-span-2 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Medical Notes
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.medicalNotes ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
            <h2 className="text-lg lg:text-[20px] font-semibold text-gray-900 mb-5">
              Parent / Guardian Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Father Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.fatherName ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Father Contact
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {displayMobile(student?.fatherMobile)}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Mother Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.motherName ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Mother Contact
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {displayMobile(student?.motherMobile)}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Guardian Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.guardianName ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Guardian Contact
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {displayMobile(student?.guardianMobile)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-6 ">
          <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
            <h1 className="text-[#021034] font-[600] text-[20px] font-semibold mb-4">
              Academic Info
            </h1>
            <div className="grid grid-cols-2 w-full">
              <div>
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Class & Section
                </p>
                <div className=" border-b border-blue-200 w-full "></div>

                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Admission Date
                </p>
                <div className=" border-b border-blue-200 w-full"></div>
              </div>
              <div className="flex flex-col items-end  ">
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  {classSectionLabel(student)}
                </p>
                <div className=" border-b border-blue-200 w-full "></div>
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  {formatDisplayDate(student?.admissionDate)}
                </p>
                <div className=" border-b border-blue-200 w-full "></div>
              </div>
            </div>
          </div>
          <section className="flex flex-col  ">
            <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 ">
              <h1 className="text-[#021034] font-[600] text-[20px] font-semibold mb-4 p-[16px] flex items-center justify-between">
                Attendance
                <CalendarCheck className="text-[#737373]" />
              </h1>
              <div className="border-b border-blue-200"></div>
              <div className="space-y-8 p-5">
                <div className="py-5">
                  <div className="flex items-end gap-2">
                    <h1 className="text-5xl font-bold text-slate-900">
                      {attendancePct}%
                    </h1>

                    <span className="mb-1 text-sm font-medium text-green-600">
                      This Month Attendance
                    </span>
                  </div>

                  <div className="mt-6 h-5 w-full overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="h-full rounded-full bg-[#09153E] transition-all"
                      style={{
                        width: `${Math.min(Math.max(attendancePct, 0), 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-green-500"></span>
                      <span className="text-lg font-medium text-slate-700">
                        Present
                      </span>
                    </div>

                    <span className="rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-slate-700">
                      {attendance?.present ?? 0} Days
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-red-500"></span>
                      <span className="text-lg font-medium text-slate-700">
                        Absent
                      </span>
                    </div>

                    <span className="rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-slate-700">
                      {attendance?.absent ?? 0} Days
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                      <span className="text-lg font-medium text-slate-700">
                        Leave
                      </span>
                    </div>

                    <span className="rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-slate-700">
                      {attendance?.leave ?? 0} Days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>

      {typeof studentId === "string" ? (
        <StudentProfileDocuments studentId={studentId} />
      ) : null}
      <div className="flex w-full p-3 md:p-6">
        <p className="texr-[10px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the accounts
          department for assistance.
        </p>
      </div>
    </div>
  );
}
