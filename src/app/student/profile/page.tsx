"use client";

import React from "react";
import Image from "next/image";
import {
  getStudentProfile,
  StudentPortalProfileSkeleton,
} from "@/modules/students";
import { Card } from "../../../components/ui/Card";
import { ensureSessionReady } from "@/modules/auth";
import DocumentsGrid from "@/modules/documents/components/DocumentsGrid";
import InfoField from "@/components/profile/InfoField";
import Button from "@/components/ui/Button";
import { DOCUMENT_TYPES } from "@/modules/documents/constants";

function docTypeLabel(value: string): string {
  return DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

function formatClass(
  cls?: { name?: string; section?: string | null } | null,
): string {
  if (!cls?.name) return "Not Assigned";
  return cls.section ? `${cls.name} - ${cls.section}` : cls.name;
}

export default function StudentProfilePage() {
  const [me, setMe] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ensureSessionReady();
      const data = await getStudentProfile();
      setMe(data as Record<string, unknown>);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <StudentPortalProfileSkeleton />;

  if (error && !me) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-[#D7E3FC] bg-white p-8 text-center">
          <p className="mb-4 text-sm text-slate-700">{error}</p>
          <Button variant="dark" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const cls = me?.class as
    | { name?: string; section?: string | null }
    | null
    | undefined;
  const documents = Array.isArray(me?.documents)
    ? (me!.documents as Array<Record<string, unknown>>)
    : [];

  const documentItems = documents.map((doc) => ({
    id: String(doc.id ?? doc.url ?? Math.random()),
    title: String(
      doc.originalName ||
        doc.fileName ||
        docTypeLabel(String(doc.documentType ?? "OTHER")),
    ),
    type: docTypeLabel(String(doc.documentType ?? "OTHER")),
    href: typeof doc.url === "string" ? doc.url : undefined,
  }));

  return (
    <div className="p-3 md:p-6 bg-[#F5F9FF] min-h-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            My Profile
          </h1>
          <p className="mt-1 text-[13px] lg:text-[14px] text-[#737373]">
            View your personal, academic, and guardian details
          </p>
        </div>
      </div>
      <Card className="flex items-center gap-6 mb-[20px]">
        <div className="bg-slate-400 rounded-full overflow-hidden w-[62px] h-[62px] items-center flex-shrink-0">
          <Image
            src={
              (typeof me?.photoUrl === "string" && me.photoUrl) ||
              "/images/avatar.png"
            }
            alt="avatar"
            width={62}
            height={62}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 gap-2 flex flex-col">
          <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            {(me?.fullName as string) ?? (me?.name as string) ?? "-"}
          </div>
          <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
            Student ID:{" "}
            <span className="text-[#021034]">
              {(me?.studentCode as string) ?? (me?.id as string) ?? "-"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
              {formatClass(cls)}
            </p>
            {(me?.status as string) ? (
              <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 flex items-center justify-center rounded-full bg-[#DCFCE6] text-[#16A34A]">
                {String(me?.status)}
              </p>
            ) : null}
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-[20px]">
        <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
          <h2 className="text-[16px] lg:text-[20px] font-semibold text-gray-900 mb-5">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <InfoField
              label="Full Name"
              value={
                (me?.fullName as string) ?? (me?.name as string) ?? "-"
              }
            />
            <InfoField
              label="Date of Birth"
              value={
                me?.dob
                  ? String(me.dob).slice(0, 10)
                  : "-"
              }
            />
            <InfoField label="Gender" value={(me?.gender as string) ?? "-"} />
            <InfoField
              label="Blood Group"
              value={(me?.bloodGroup as string) ?? "-"}
            />
            <InfoField
              label="Aadhaar Number"
              value={
                (me?.aadhaarNumber as string) ??
                (me?.aadhaar as string) ??
                "-"
              }
            />
            <InfoField
              label="Phone No."
              value={
                (me?.phoneNumber as string) ?? (me?.phone as string) ?? "-"
              }
            />
            <InfoField
              label="Email Address"
              value={(me?.email as string) ?? "-"}
            />
            <div className="col-span-2">
              <InfoField
                label="Address"
                value={(me?.address as string) ?? "-"}
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[16px]">
          <h2 className="text-lg lg:text-[20px] font-semibold text-gray-900 mb-5">
            Parent / Guardian Information
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Father Name
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {(me?.fatherName as string) ??
                  ((me?.guardian as { fatherName?: string } | undefined)
                    ?.fatherName) ??
                  "-"}
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Father Mobile
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {(me?.fatherMobile as string) ?? "-"}
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Mother Name
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {(me?.motherName as string) ??
                  ((me?.guardian as { motherName?: string } | undefined)
                    ?.motherName) ??
                  "-"}
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Mother Mobile
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {(me?.motherMobile as string) ??
                  ((me?.guardian as { phone?: string } | undefined)?.phone) ??
                  "-"}
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Guardian Name
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {(me?.guardianName as string) ?? "-"}
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Guardian Mobile
              </p>
              <p className="text-[11px] lg:text-[14px] font-[500] text-gray-900">
                {(me?.guardianMobile as string) ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {documentItems.length === 0 ? (
        <div className="w-full rounded-xl border border-[#D7E3FC] bg-white p-8 mt-6 text-center text-sm text-slate-500">
          No documents on file.
        </div>
      ) : (
        <DocumentsGrid documents={documentItems} />
      )}
      <div className="flex w-full p-3 md:p-6">
        <p className="text-[10px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the school office for
          assistance.
        </p>
      </div>
    </div>
  );
}
