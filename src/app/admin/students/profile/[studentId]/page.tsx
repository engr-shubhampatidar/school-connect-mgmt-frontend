"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStudentById, type StudentDetails, StudentProfileSkeleton } from "@/modules/students";
import Image from "next/image";
import { Card } from "@/components/ui";
import { CalendarCheck } from "lucide-react";

export default function StudentDetailsPage() {
  const { studentId } = useParams();

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await getStudentById(studentId as string);
        setStudent(data);
        console.log(student);
      } catch {
        // igrone it
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [studentId]);

  if (loading) return <StudentProfileSkeleton />;

  return (
    <div className="p-3 md:p-6 ">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {`About ${student?.name ? student?.name : "Student"}`}
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
            <span className="text-[#021034]">{student?.id ?? "-"}</span>
          </div>
          <div className="flex gap-2">
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
              {student?.name}
            </p>
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center  rounded-full bg-[#DBEAFF] text-[#1E3A8A]">
              {student ? "Not Assigned" : "Not Assigned"}
            </p>
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center  rounded-full bg-[#F4E8FF] text-[#6930B3]">
              {student ? "2026-27" : "2026-27"}
            </p>
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center  rounded-full bg-[#DCFCE6] text-[#16A34A]">
              {student ? "N/A" : "N/A"}
            </p>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-[20px]">
        <section className=" flex flex-col gap-6 col-span-2">
          <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
            {/* Title */}
            <h2 className="text-[16px] lg:text-[20px] font-semibold text-gray-900 mb-5">
              Personal Information
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {/* Full Name */}

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Full Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.name ?? "-"}
                </p>
              </div>

              {/* Date of Birth */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Date of Birth
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.dob ?? "-"}
                </p>
              </div>

              {/* Gender */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">Gender</p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.gender ?? "-"}
                </p>
              </div>

              {/* Blood Group */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Blood Group
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student ? "-" : "-"}
                </p>
              </div>

              {/* Category */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Category
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.category ?? "-"}
                </p>
              </div>

              {/* Aadhaar Number */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Aadhaar Number
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.aadhaar ?? "-"}
                </p>
              </div>

              {/* Phone */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Phone No.
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.phoneNo ?? "-"}
                </p>
              </div>

              {/* Email */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Email Address
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.email ?? "-"}
                </p>
              </div>

              {/* Address (Full Width) */}
              <div className="col-span-2 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">Address</p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.address ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
            {/* Title */}
            <h2 className="text-lg lg:text-[20px] font-semibold text-gray-900 mb-5">
              Parent / Guardian Information
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
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
                  Mother Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.motherName ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Parent Contact
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.fatherMobile ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Parent Mail
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {student?.fatherEmail ?? "-"}
                </p>
              </div>
            </div>
            {/* Address (Full Width) */}
            <div className="c border border-blue-200 rounded-lg p-3 bg-blue-50 mt-4">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Local Address
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {student?.emergencyContact ?? student?.address ?? "-"}
              </p>
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
                  Academic Number
                </p>
                <div className=" border-b border-blue-200 w-full "></div>

                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Class & Section
                </p>
                <div className=" border-b border-blue-200 w-full "></div>

                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Stream
                </p>
                <div className=" border-b border-blue-200 w-full "></div>

                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Medium
                </p>
                <div className=" border-b border-blue-200 w-full "></div>

                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Admission Date
                </p>
                <div className=" border-b border-blue-200 w-full"></div>
              </div>
              <div className="flex flex-col items-end  ">
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  ADM2024042
                </p>
                <div className=" border-b border-blue-200 w-full "></div>
                <p className="font-[500] text-[14px] text-[#021034] py-4">10</p>
                <div className=" border-b border-blue-200 w-full "></div>
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  Science
                </p>
                <div className=" border-b border-blue-200 w-full "></div>
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  English
                </p>
                <div className=" border-b border-blue-200 w-full "></div>
                <p className="font-[500] text-[14px] text-[#021034] py-4">
                  10 April 2025
                </p>
                <div className=" border-b border-blue-200 w-full "></div>
              </div>
            </div>
          </div>
          <section className="flex flex-col  ">
            <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 ">
              <h1 className="text-[#021034] font-[600] text-[20px] font-semibold mb-4 p-[16px] flex items-center justify-between">
                Academic Info
                <CalendarCheck className="text-[#737373]" />
              </h1>
              <div className="border-b border-blue-200"></div>
              <div className="space-y-8 p-5">
                <div className="py-5">
                  <div className="flex items-end gap-2">
                    <h1 className="text-5xl font-bold text-slate-900">94.5%</h1>

                    <span className="mb-1 text-sm font-medium text-green-600">
                      This Month Attendance
                    </span>
                  </div>

                  <div className="mt-6 h-5 w-full overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-[80%] rounded-full bg-[#09153E]"></div>
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
                      85 Days
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
                      05 Days
                    </span>
                  </div>
                </div>

                <button className="w-full rounded-lg border border-blue-200 py-3 text-lg font-semibold text-slate-900 transition hover:bg-blue-50">
                  View Full Attendance
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>

      <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[20px]">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Uploaded Documents
        </h2>

        {/* Document Item */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aadhaar Card */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Aadhar Card</p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>

          {/* Previous Marksheet */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Previous Marksheet
                </p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>

          {/* Birth Certificate */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Birth Certificate
                </p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>

          {/* Transfer Certificate */}
          <div className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Transfer Certificate
                </p>
                <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                  PDF
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
              👁
              <span>View</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full p-3 md:p-6">
        <p className="texr-[10px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the accounts
          department for assistance.
        </p>
      </div>
    </div>
  );
}

// function Info({ title, value }: { title: string; value?: string | null }) {
//   return (
//     <div className="rounded-lg border p-4">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="mt-1 text-lg font-medium">{value || "-"}</p>
//     </div>
//   );
// }
