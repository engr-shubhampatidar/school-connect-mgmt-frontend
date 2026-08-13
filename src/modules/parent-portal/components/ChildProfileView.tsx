"use client";

import Card from "@/components/ui/Card";
import InfoField from "@/components/profile/InfoField";
import { useChildProfileQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatClassLabel,
  formatErrorMessage,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildProfileView({
  studentId,
}: {
  studentId: string;
}) {
  const { data, isLoading, error, refetch } = useChildProfileQuery(studentId);

  if (isLoading) return <PortalLoading rows={4} />;
  if (error || !data) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Failed to load profile")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title={data.fullName}
        description="Read-only student profile"
      />

      <Card className="mb-5">
        <div className="text-[20px] font-[600] text-[#021034]">
          {data.fullName}
        </div>
        <div className="mt-1 text-sm text-[#737373]">
          Student ID: {data.studentCode ?? data.id}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#D7E3FC] bg-[#F5F9FF] px-2 py-1 text-xs font-semibold text-[#021034]">
            {formatClassLabel(data.class?.name, data.class?.section)}
          </span>
        </div>
      </Card>

      <div className="mb-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <h2 className="mb-5 text-[16px] font-semibold text-gray-900 lg:text-[20px]">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoField label="Full Name" value={data.fullName} />
            <InfoField label="Date of Birth" value={data.dob ?? "—"} />
            <InfoField label="Gender" value={data.gender ?? "—"} />
            <InfoField label="Blood Group" value={data.bloodGroup ?? "—"} />
            <InfoField
              label="Aadhaar Number"
              value={data.aadhaarNumber ?? "—"}
            />
            <InfoField label="Phone No." value={data.phone ?? "—"} />
            <InfoField label="Email Address" value={data.email ?? "—"} />
            <div className="sm:col-span-2">
              <InfoField label="Address" value={data.address ?? "—"} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <h2 className="mb-5 text-[16px] font-semibold text-gray-900 lg:text-[20px]">
            Parent / Guardian Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoField label="Father Name" value={data.fatherName ?? "—"} />
            <InfoField
              label="Father Contact"
              value={data.fatherMobile ?? "—"}
            />
            <InfoField label="Mother Name" value={data.motherName ?? "—"} />
            <InfoField
              label="Mother Contact"
              value={data.motherMobile ?? "—"}
            />
            <InfoField
              label="Guardian Name"
              value={data.guardianName ?? "—"}
            />
            <InfoField
              label="Guardian Contact"
              value={data.guardianMobile ?? "—"}
            />
            {data.medicalNotes ? (
              <div className="sm:col-span-2">
                <InfoField label="Medical Notes" value={data.medicalNotes} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-[#737373]">
        This profile is read-only. Contact the school office for corrections.
      </p>
    </PortalPageShell>
  );
}
