"use client";
import React from "react";
import studentApi from "../../../lib/studentApi";
import { Card } from "../../../components/ui/Card";
import Image from "next/image";

export default function Page() {
  return (
      <Inner />
  );
}

function Inner() {
  const [me, setMe] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await studentApi.get("/api/student/profile");
        if (!mounted) return;
        setMe(res.data);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="p-3 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-[62px] h-[62px] rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="grid grid-cols-1 gap-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="grid grid-cols-1 gap-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-3 md:p-6 ">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            Total Students
          </h1>
          <p className="mt-1 text-[13px] lg:text-[14px] text-[#737373]">
            Manage, Student Profiles, status and Enrollment
          </p>
        </div>
      </div>
      <Card className="flex items-center gap-6 mb-[20px]">
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
            <span className="text-[#021034]">{me?.student?.rollNo ?? "-"}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-[20px]">
        <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
          {/* Title */}
          <h2 className="text-[16px] lg:text-[20px] font-semibold text-gray-900 mb-5">
            Personal Information
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Full Name</p>
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
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Category</p>
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
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Phone No.</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
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
          If any information is incorrect, please contact the school office for
          assistance.
        </p>
      </div>
    </div>
  );
}
