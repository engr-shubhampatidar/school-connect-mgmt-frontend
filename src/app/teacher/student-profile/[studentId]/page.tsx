"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import Card from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import API from "@/services/axios";
import { getStudentProfile } from "@/modules/students";

// type StudentProfile = {
//   student?: {
//     id?: string;
//     studentId?: string;
//     name?: string;
//     rollNo?: string;
//     dob?: string;
//     gender?: string;
//     bloodGroup?: string;
//     category?: string;
//     aadhaar?: string;
//     phone?: string;
//     email?: string;
//     stream?: string;
//   };

//   phone?: string;
//   address?: string;
//   photoUrl?: string;

//   class?: {
//     id?: string;
//     name?: string;
//     section?: string;
//   };

//   session?: string;
//   status?: string;

//   guardian?: {
//     fatherName?: string;
//     motherName?: string;
//     phone?: string;
//     email?: string;
//     localAddress?: string;
//   };

//   academic?: {
//     academicNumber?: string;
//     className?: string;
//     section?: string;
//     stream?: string;
//     medium?: string;
//     admissionDate?: string;
//   };

//   attendance?: {
//     percentage?: number;
//     present?: number;
//     absent?: number;
//   };
// };

export default function StudentProfilePage() {
  const params = useParams();

  const studentId = params?.studentId as string;


 const [student, setStudent] = useState<getStudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/teacher/myclass/student/${studentId}`
        );

        console.log("Student Profile API Response:", response.data);

        setStudent(response.data);
      } catch (error: any) {
        console.error("Failed to fetch student profile:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load student profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading student profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-5">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
          Student profile not found.
        </div>
      </div>
    );
  }

  const attendancePercentage =
    student.attendance?.percentage ?? 0;

  return (
    <>
      {/* Header */}
      <div className="px-5 pt-5 pb-0">
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] font-[600] text-[#021034]">
                Student Profile
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                Manage and view student information
              </p>
            </div>

            <div className="flex gap-5">
              <Button variant="dark">
                + Attendance History
              </Button>

              <Button variant="dark">
                + Mark Attendance
              </Button>
            </div>
          </div>
        </section>

        {/* Student Header */}
        <Card className="flex items-center gap-6">
          <div className="flex h-[62px] w-[62px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-400">
            <Image
              src={student.photoUrl || "/images/avatar.png"}
              alt={student.student?.name || "Student"}
              width={62}
              height={62}
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="text-[20px] font-[600] text-[#021034] lg:text-[24px]">
              {student.student?.name ?? "-"}
            </div>

            <div className="text-[13px] font-[400] text-[#737373] lg:text-[14px]">
              Student ID:{" "}
              <span className="text-[#021034]">
                {student.student?.rollNo ??
                  student.student?.studentId ??
                  studentId}
              </span>
            </div>

            <div className="flex gap-2">
              <p className="rounded-full border border-[#D7E3FC] bg-[#F5F9FF] px-2 py-[3px] text-[8px] font-[600] lg:text-[10px]">
                {student.class?.name
                  ? `${student.class.name}${
                      student.class.section
                        ? ` - ${student.class.section}`
                        : ""
                    }`
                  : "Not Assigned"}
              </p>

              <p className="flex items-center justify-center rounded-full bg-[#DBEAFF] px-2 py-[3px] text-[8px] font-[600] text-[#1E3A8A] lg:text-[10px]">
                {student.student?.stream ?? "Not Assigned"}
              </p>

              <p className="flex items-center justify-center rounded-full bg-[#F4E8FF] px-2 py-[3px] text-[8px] font-[600] text-[#6930B3] lg:text-[10px]">
                {student.session ?? "2026-27"}
              </p>

              <p className="flex items-center justify-center rounded-full bg-[#DCFCE6] px-2 py-[3px] text-[8px] font-[600] text-[#16A34A] lg:text-[10px]">
                {student.status ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex gap-5 p-5">
        <div className="mb-[20px] flex w-full flex-col gap-6">

          {/* Personal Information */}
          <div className="w-full rounded-xl border border-blue-200 bg-white p-[16px]">
            <h2 className="mb-5 text-[16px] font-semibold text-gray-900 lg:text-[20px]">
              Personal Information
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <InfoItem
                label="Full Name"
                value={student.student?.name}
              />

              <InfoItem
                label="Date of Birth"
                value={student.student?.dob}
              />

              <InfoItem
                label="Gender"
                value={student.student?.gender}
              />

              <InfoItem
                label="Blood Group"
                value={student.student?.bloodGroup}
              />

              <InfoItem
                label="Category"
                value={student.student?.category}
              />

              <InfoItem
                label="Aadhaar Number"
                value={student.student?.aadhaar}
              />

              <InfoItem
                label="Phone No."
                value={
                  student.phone ??
                  student.student?.phone
                }
              />

              <InfoItem
                label="Email Address"
                value={student.student?.email}
              />

              <div className="col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="mb-1 text-xs text-gray-500 lg:text-sm">
                  Address
                </p>

                <p className="text-[11px] font-[500] text-gray-900 lg:text-[14px]">
                  {student.address ?? "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Parent / Guardian */}
          <div className="w-full rounded-xl border border-blue-200 bg-white p-[16px]">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 lg:text-[20px]">
              Parent / Guardian Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Father Name"
                value={student.guardian?.fatherName}
              />

              <InfoItem
                label="Mother Name"
                value={student.guardian?.motherName}
              />

              <InfoItem
                label="Parent Contact"
                value={student.guardian?.phone}
              />

              <InfoItem
                label="Parent Mail"
                value={student.guardian?.email}
              />
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="mb-1 text-xs text-gray-500 lg:text-sm">
                Local Address
              </p>

              <p className="text-[11px] font-[500] text-gray-900 lg:text-[14px]">
                {student.guardian?.localAddress ??
                  student.address ??
                  "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-5">

          {/* Academic Info */}
          <div className="min-w-md max-h-full rounded-xl border border-blue-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#021034]">
              Academic Info
            </h2>

            <AcademicRow
              label="Academic Number"
              value={student.academic?.academicNumber}
            />

            <AcademicRow
              label="Class & Section"
              value={
                student.class?.name
                  ? `${student.class.name}${
                      student.class.section
                        ? ` - ${student.class.section}`
                        : ""
                    }`
                  : "-"
              }
            />

            <AcademicRow
              label="Stream"
              value={student.student?.stream}
            />

            <AcademicRow
              label="Medium"
              value={student.academic?.medium}
            />

            <div className="flex items-center justify-between pt-3 text-sm">
              <span className="font-medium text-[#021034]">
                Admission Date
              </span>

              <span className="text-[#021034]">
                {student.academic?.admissionDate ?? "-"}
              </span>
            </div>
          </div>

          {/* Attendance */}
          <div className="max-w-md rounded-xl border border-blue-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between border-b border-blue-200 pb-3">
              <h2 className="text-lg font-semibold text-[#021034]">
                Attendance Summary
              </h2>

              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 text-gray-600">
                📅
              </div>
            </div>

            <div className="mb-4 py-8">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-[#021034]">
                  {attendancePercentage}%
                </span>

                <span className="text-sm text-green-600">
                  This Month Attendance
                </span>
              </div>
            </div>

            <div className="mb-8 h-3 w-full rounded-full bg-blue-100">
              <div
                className="h-3 rounded-full bg-[#021034]"
                style={{
                  width: `${Math.min(
                    Math.max(attendancePercentage, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="mb-5 space-y-3">

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-[#021034]">
                    Present
                  </span>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-[#021034]">
                  {student.attendance?.present ?? 0} Days
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[#021034]">
                    Absent
                  </span>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-[#021034]">
                  {student.attendance?.absent ?? 0} Days
                </span>
              </div>
            </div>

            <div className="cursor-pointer rounded-md border border-blue-200 py-2 text-center text-sm font-semibold text-[#021034] hover:bg-blue-50">
              View Full Attendance
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
      <p className="mb-1 text-xs text-gray-500 lg:text-sm">
        {label}
      </p>

      <p className="text-[11px] font-[500] text-gray-900 lg:text-[14px]">
        {value ?? "-"}
      </p>
    </div>
  );
}

function AcademicRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-blue-200 py-3 text-sm">
      <span className="font-medium text-[#021034]">
        {label}
      </span>

      <span className="text-[#021034]">
        {value ?? "-"}
      </span>
    </div>
  );
}