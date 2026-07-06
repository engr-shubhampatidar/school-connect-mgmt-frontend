"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../../../../../components/ui/Card";
import ClassSubjectAllocationTable from "./components/ClassSubjectAllocationTable";
import Button from "../../../../../components/ui/Button";
import EditTeacherDialog from "../../../../../components/admin/EditTeacherDialog";
import { fetchTeacherById } from "@/services/teacher.service";

const allocations: {
  grade: string;
  section: string;
  subject: string;
  role: "Class Teacher" | "Subject Teacher";
}[] = [
  {
    grade: "Grade-10",
    section: "Section-A",
    subject: "Mathematics",
    role: "Class Teacher",
  },
  {
    grade: "Grade-09",
    section: "Section-A",
    subject: "English",
    role: "Subject Teacher",
  },
];
interface Teacher {
  fullName: string;
  employee_id: string;
  date_of_birth: string | null;
  gender: string;
  aadhar: string;
  mobile: string;
  email: string;
  address: string;
  subject_speciality: string[];
}
export default function Page() {
  const params = useParams();
  const teacherId = params?.teacherId;
  const teacherIdStr = Array.isArray(teacherId) ? teacherId[0] : teacherId;
  const [profile, setProfile] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const subjectCount = profile?.subject_speciality?.length ?? 0;

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      const data = await fetchTeacherById(id);
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!teacherIdStr) return;
    fetchProfile(teacherIdStr as string);
  }, [teacherIdStr]);

  if (loading) {
    return (
      <div className="p-3 md:p-6 animate-pulse">
        {/* Header Skeleton */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="h-8 w-64 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded" />
          </div>
        </section>

        {/* Profile Card Skeleton */}
        <Card className="flex items-center gap-6 mb-[20px]">
          <div className="rounded-full bg-slate-200 w-[62px] h-[62px] flex-shrink-0" />
          <div className="flex-1 gap-2 flex flex-col">
            <div className="h-7 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-28 bg-slate-200 rounded-full" />
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
            </div>
          </div>
        </Card>

        {/* Personal Info Skeleton */}
        <div className="bg-white rounded-xl border border-blue-200 p-[16px] mb-[20px]">
          <div className="h-6 w-48 bg-slate-200 rounded mb-5" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="border border-blue-200 rounded-lg p-3 bg-blue-50/50">
                <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-36 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
          <div className="mt-4 border border-blue-200 rounded-lg p-3 bg-blue-50/50">
            <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Class & Subject Allocation Table Skeleton */}
        <div className="w-full bg-white border border-[#D7E3FC] rounded-xl overflow-hidden mb-[20px]">
          <div className="flex items-center justify-between px-4 py-6 border-b border-[#D7E3FC]">
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-10 w-56 bg-slate-200 rounded" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500">Class</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500">Section</th>
                  <th className="py-4 text-xs font-semibold text-gray-500">Subject Allocate</th>
                  <th className="py-4 text-xs font-semibold text-gray-500">Role Allocate</th>
                  <th className="text-right pr-4 py-4 text-xs font-semibold text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <tr key={idx} className="border-t border-[#D7E3FC]">
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-16 bg-slate-200 rounded-full" />
                    </td>
                    <td className="py-4">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                    </td>
                    <td className="py-4">
                      <div className="h-6 w-24 bg-slate-200 rounded-full" />
                    </td>
                    <td className="text-right pr-4 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                        <div className="h-8 w-16 bg-slate-200 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex w-full p-3 md:p-6">
          <div className="h-4 w-96 bg-slate-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] text-[#021034] font-[600]">
              Teacher Profile Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage, view and Edit Teacher
            </p>
          </div>

          <Button onClick={() => setOpen(true)} variant="dark">
            + Edit Profile
          </Button>

          <EditTeacherDialog
            open={open}
            teacherId={teacherIdStr as any}
            onClose={() => setOpen(false)}
            onUpdated={() =>
              teacherIdStr && fetchProfile(teacherIdStr as string)
            }
          />
        </div>
      </section>

      {/* Profile Card */}
      <Card className="flex items-center gap-6 mb-[20px]">
        <div className="bg-slate-400 rounded-full overflow-hidden w-[62px] h-[62px] flex-shrink-0">
          <Image
            src="/images/avatar.png"
            alt="avatar"
            width={62}
            height={62}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 gap-2 flex flex-col">
          <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {profile?.fullName ?? "---"}
          </div>

          <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
            Teacher ID:{" "}
            <span className="text-[#021034]">
              {profile?.employee_id ?? "---"}
            </span>
          </div>

          <div className="flex gap-2">
            {subjectCount > 0 && (
              <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
                {subjectCount} Subjects Assigned
              </p>
            )}

            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 rounded-full bg-[#DCFCE6] text-[#16A34A]">
              Active
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-blue-200 p-[16px] mb-[20px]">
        <h2 className="text-[16px] lg:text-[20px] font-semibold mb-5">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InfoCard label="Full Name" value={profile?.fullName} />
          <InfoCard label="Date of Birth" value={profile?.date_of_birth} />
          <InfoCard label="Gender" value={profile?.gender} />
          <InfoCard label="Aadhaar Number" value={profile?.aadhar} />
          <InfoCard label="Phone No." value={profile?.mobile} />
          <InfoCard label="Email Address" value={profile?.email} />
        </div>

        <div className="mt-4">
          <InfoCard label="Address" value={profile?.address} />
        </div>
      </div>

      {/* Class & Subject Allocation */}
      <div className="mb-[20px]">
        <ClassSubjectAllocationTable data={allocations} />
      </div>

      {/* Footer */}
      <div className="flex w-full p-3 md:p-6">
        <p className="text-[10px] lg:text-[14px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the school office.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Helper Component ---------------- */

function InfoCard({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
      <p className="text-xs lg:text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-[11px] lg:text-[14px] font-[500]">{value ?? "---"}</p>
    </div>
  );
}
