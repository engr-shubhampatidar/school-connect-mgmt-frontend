"use client";
import React from "react";
import { getStudentProfile, StudentPortalProfileSkeleton } from "@/modules/students";
import { Card } from "../../../components/ui/Card";
import Image from "next/image";
import { ensureSessionReady } from "@/modules/auth";
import DocumentsGrid from "@/modules/documents/components/DocumentsGrid";
import InfoField from "@/components/profile/InfoField";

export default function StudentProfilePage() {
  const [me, setMe] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        await ensureSessionReady();
        if (!mounted) return;
        const data = await getStudentProfile();
        if (!mounted) return;
        setMe(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <StudentPortalProfileSkeleton />;

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
            src={me?.photoUrl || "/images/avatar.png"}
            alt="avatar"
            width={62}
            height={62}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 gap-2 flex flex-col">
          <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {me?.fullName ?? "-"}
          </div>
          <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
            Student ID:{" "}
            <span className="text-[#021034]">{me?.id ?? "-"}</span>
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
              {me?.stream ?? "Not Assigned"}
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
            <InfoField label="Full Name" value={me?.name ?? "-"} />
            <InfoField label="Date of Birth" value={me?.dob ?? "-"} />
            <InfoField label="Gender" value={me?.gender ?? "-"} />
            <InfoField label="Blood Group" value={me?.bloodGroup ?? "-"} />
            <InfoField label="Category" value={me?.category ?? "-"} />
            <InfoField label="Aadhaar Number" value={me?.aadhaar ?? "-"} />
            <InfoField label="Phone No." value={me?.phone ?? "-"} />
            <InfoField label="Email Address" value={me?.email ?? "-"} />
            <div className="col-span-2">
              <InfoField label="Address" value={me?.address ?? "-"} />
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

      <DocumentsGrid />
      <div className="flex w-full p-3 md:p-6">
        <p className="texr-[10px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the school office for
          assistance.
        </p>
      </div>
    </div>
  );
}
