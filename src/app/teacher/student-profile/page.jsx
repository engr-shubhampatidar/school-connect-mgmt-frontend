import React from "react";
import Card from "../../../components/ui/Card";
import Image from "next/image";
import { Button } from "../../../components/ui/Button";

export default function page() {
  const me = {
    student: {
      name: "John Doe",
      dob: "2008-05-15",
      gender: "Male",
      bloodGroup: "A+",
      category: "General",
      aadhaar: "1234-5678-9012",
      phone: "9876543210",
      email: "johndoe@example.com",
    },
    phone: "9876543210",
    address: "123 Main St, Springfield",
    guardian: {
      fatherName: "Michael Doe",
      motherName: "Jane Doe",
      phone: "9876500000",
      email: "parent@example.com",
      localAddress: "123 Main St, Springfield",
    },
  };
  return (
    <>
      <div className="px-5 pt-5 pb-0">
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] text-[#021034] font-[600]">
                Classes & Sections
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage, view and organize all classes and sections
              </p>
            </div>

            <div className="flex gap-5">
              <Button variant="dark">+ Attendance History</Button>
              <Button variant="dark">+ Mark Attendance</Button>
            </div>
          </div>
        </section>
        <Card className="flex items-center gap-6 ">
          <div className="bg-slate-400 rounded-full overflow-hidden w-[62px] h-[62px] items-center flex-shrink-0">
            <Image
              src={me?.photoUrl || me?.photoUrl || "/images/avatar.png"}
              alt="avatar"
              width={62}
              height={62}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 gap-2 flex flex-col">
            <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
              {me?.student?.name ?? "-"}
            </div>
            <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
              Student ID:{" "}
              <span className="text-[#021034]">
                {me?.student?.rollNo ?? "-"}
              </span>
            </div>
            <div className="flex gap-2">
              <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
                {me?.class?.name
                  ? `${me.class.name}${
                      me.class.section ? " - " + me.class.section : ""
                    }`
                  : "Not Assigned"}
              </p>
              <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center  rounded-full bg-[#DBEAFF] text-[#1E3A8A]">
                {me?.student?.stream ?? "Not Assigned"}
              </p>
              <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center  rounded-full bg-[#F4E8FF] text-[#6930B3]">
                {me?.session ?? "2026-27"}
              </p>
              <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center  rounded-full bg-[#DCFCE6] text-[#16A34A]">
                {me?.status ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="p-5 flex gap-5">
        <div className="flex flex-col w-full gap-6 mb-[20px]">
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
                  {me?.student?.name ?? "-"}
                </p>
              </div>

              {/* Date of Birth */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Date of Birth
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.student?.dob ?? "-"}
                </p>
              </div>

              {/* Gender */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">Gender</p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.student?.gender ?? "-"}
                </p>
              </div>

              {/* Blood Group */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Blood Group
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.student?.bloodGroup ?? "-"}
                </p>
              </div>

              {/* Category */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Category
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.student?.category ?? "-"}
                </p>
              </div>

              {/* Aadhaar Number */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Aadhaar Number
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.student?.aadhaar ?? "-"}
                </p>
              </div>

              {/* Phone */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Phone No.
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.phone ?? me?.student?.phone ?? "-"}
                </p>
              </div>

              {/* Email */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Email Address
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.student?.email ?? "-"}
                </p>
              </div>

              {/* Address (Full Width) */}
              <div className="col-span-2 border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">Address</p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.address ?? "-"}
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
            <div className="grid grid-cols-2  gap-4">
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Father Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.guardian?.fatherName ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Mother Name
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.guardian?.motherName ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Parent Contact
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.guardian?.phone ?? "-"}
                </p>
              </div>

              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Parent Mail
                </p>
                <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                  {me?.guardian?.email ?? "-"}
                </p>
              </div>
            </div>
            {/* Address (Full Width) */}
            <div className="c border border-blue-200 rounded-lg p-3 bg-blue-50 mt-4">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Local Address
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {me?.guardian?.localAddress ?? me?.address ?? "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className=" min-w-md max-h-full rounded-xl border border-blue-200 bg-white p-6">
            {/* Title */}
            <h2 className="mb-4 text-lg font-semibold text-[#021034]">
              Academic Info
            </h2>

            {/* Item */}
            <div className="flex items-center justify-between border-b border-blue-200 py-3 text-sm">
              <span className="text-[#021034] font-medium">
                Academic Number
              </span>
              <span className="text-[#021034]">ADM2024042</span>
            </div>

            <div className="flex items-center justify-between border-b border-blue-200 py-3 text-sm">
              <span className="text-[#021034] font-medium">
                Class & Section
              </span>
              <span className="text-[#021034]">10</span>
            </div>

            <div className="flex items-center justify-between border-b border-blue-200 py-3 text-sm">
              <span className="text-[#021034] font-medium">Stream</span>
              <span className="text-[#021034]">Science</span>
            </div>

            <div className="flex items-center justify-between border-b border-blue-200 py-3 text-sm">
              <span className="text-[#021034] font-medium">Medium</span>
              <span className="text-[#021034]">English</span>
            </div>

            <div className="flex items-center justify-between pt-3 text-sm">
              <span className="text-[#021034] font-medium">Admission Date</span>
              <span className="text-[#021034]">10 April 2025</span>
            </div>
          </div>
          <div className="max-w-md rounded-xl border border-blue-200 bg-white p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-blue-200 pb-3">
              <h2 className="text-lg font-semibold text-[#021034]">
                Attendance Summary
              </h2>

              {/* Calendar Icon */}
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 text-gray-600">
                📅
              </div>
            </div>

            {/* Percentage */}
            <div className="mb-4 py-8">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-[#021034]">94.5%</span>
                <span className="text-sm text-green-600">
                  This Month Attendance
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 h-3 w-full rounded-full bg-blue-100 ">
              <div
                className="h-3 rounded-full bg-[#021034]"
                style={{ width: "94.5%" }}
              />
            </div>

            {/* Stats */}
            <div className="mb-5 space-y-3">
              {/* Present */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-[#021034]">Present</span>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-[#021034]">
                  85 Days
                </span>
              </div>

              {/* Absent */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[#021034]">Absent</span>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-[#021034]">
                  05 Days
                </span>
              </div>
            </div>

            {/* Button */}
            <div className="rounded-md border border-blue-200 py-2 text-center text-sm font-semibold text-[#021034] hover:bg-blue-50 cursor-pointer">
              View Full Attendance
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
