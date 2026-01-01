"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../ui";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Separator from "../ui/Separator";
import API from "../../lib/axios";
import Image from "next/image";

type Profile = {
  dob?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  primaryGuardianName?: string | null;
  primaryGuardianPhone?: string | null;
  secondaryGuardianName?: string | null;
  secondaryGuardianPhone?: string | null;
  emergencyContact?: string | null;
  notes?: string | null;
};

type StudentProfile = {
  id: string;
  name: string;
  rollNo?: string | null;
  classId?: string | null;
  photoUrl?: string | null;
  profile?: Profile | null;
};

type Props = {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function StudentDetailsDrawer({
  studentId,
  isOpen,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudentProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!isOpen || !studentId) return;
    setLoading(true);
    setError(null);
    setData(null);

    (async () => {
      try {
        const res = await API.get(`/api/admin/students/${studentId}/profile`);
        if (!mounted) return;
        setData(res.data as StudentProfile);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, studentId]);

  const renderOrDash = (v?: string | null) => (v && v.trim() ? v : "-");

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div className="w-full flex justify-center">
        <DrawerContent className="max">
          <DrawerHeader>
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  {/* // eslint-disable-next-line @next/next/no-img-element */}
                  {data?.photoUrl ? (
                    <Image
                      src={data?.photoUrl ?? "/images/avatar.png"}
                      alt={data.name}
                      width={72}
                      height={72}
                      unoptimized
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-600">
                      {data?.name
                        ? data.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "NA"}
                    </span>
                  )}
                </div>

                <div>
                  <DrawerTitle className="text-lg">
                    {data?.name ?? (loading ? "Loading..." : "Student details")}
                  </DrawerTitle>
                  <div className="text-sm text-slate-600">
                    {data?.rollNo ? `Roll No: ${data.rollNo}` : ""}
                  </div>
                </div>
              </div>

              <DrawerClose asChild>
                <button
                  aria-label="Close"
                  className="rounded p-1 hover:bg-slate-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 8.586L15.95 2.636a1 1 0 111.414 1.414L11.414 10l5.95 5.95a1 1 0 01-1.414 1.414L10 11.414l-5.95 5.95a1 1 0 01-1.414-1.414L8.586 10 2.636 4.05A1 1 0 014.05 2.636L10 8.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-4 space-y-4 max-h-[70vh] overflow-auto">
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-20 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ) : error ? (
              <Card>
                <div className="flex flex-col items-start gap-4">
                  <div className="text-sm text-red-700">Error: {error}</div>
                  <Button
                    onClick={() => {
                      // trigger refetch by toggling open
                      if (studentId) {
                        setLoading(true);
                        setError(null);
                        setData(null);
                        API.get(`/api/admin/students/${studentId}/profile`)
                          .then((res) => setData(res.data as StudentProfile))
                          .catch((e) => setError(e?.message ?? "Failed"))
                          .finally(() => setLoading(false));
                      }
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </Card>
            ) : data ? (
              <div className="space-y-4">
                <Card>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Academic Info
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
                    <div>
                      <div className="text-xs text-slate-500">Student ID</div>
                      <div className="mt-1 font-medium text-slate-900 flex items-center gap-2">
                        <span>{data.id}</span>
                        <button
                          onClick={() =>
                            navigator.clipboard?.writeText(data.id)
                          }
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Class Name</div>
                      <div className="mt-1 font-medium text-slate-900">
                        {data?.className  ? data?.className : "-"}{" "}
                        {data?.section ? `- ${data.section}` : ""}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Roll No</div>
                      <div className="mt-1 font-medium text-slate-900">
                        {renderOrDash(data.rollNo)}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Personal Info
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
                    <div>
                      <div className="text-xs text-slate-500">
                        Date of Birth
                      </div>
                      <div className="mt-1">
                        {data.profile?.dob
                          ? new Date(data.profile.dob).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Country</div>
                      <div className="mt-1">
                        {renderOrDash(data.profile?.country)}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">Address</div>
                      <div className="mt-1 text-sm text-slate-800">
                        {data.profile?.addressLine1
                          ? data.profile.addressLine1
                          : ""}
                        {data.profile?.addressLine2
                          ? `, ${data.profile.addressLine2}`
                          : ""}
                        {!(
                          data.profile?.addressLine1 ||
                          data.profile?.addressLine2
                        )
                          ? "-"
                          : null}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">City</div>
                      <div className="mt-1">
                        {renderOrDash(data.profile?.city)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        State / Postal
                      </div>
                      <div className="mt-1">
                        {renderOrDash(data.profile?.state)}{" "}
                        {data.profile?.postalCode
                          ? `, ${data.profile.postalCode}`
                          : ""}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Guardian Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-800">
                    <div>
                      <div className="text-xs text-slate-500">
                        Primary Guardian
                      </div>
                      <div className="mt-1">
                        {renderOrDash(data.profile?.primaryGuardianName)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {renderOrDash(data.profile?.primaryGuardianPhone)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        Secondary Guardian
                      </div>
                      <div className="mt-1">
                        {renderOrDash(data.profile?.secondaryGuardianName)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {renderOrDash(data.profile?.secondaryGuardianPhone)}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">
                        Emergency Contact
                      </div>
                      <div className="mt-1">
                        {renderOrDash(data.profile?.emergencyContact)}
                      </div>
                    </div>
                  </div>
                </Card>

                <div>
                  <h4 className="text-sm font-semibold text-slate-700">
                    Notes
                  </h4>
                  <div className="mt-2 text-sm text-slate-800">
                    {data.profile?.notes && data.profile.notes.trim()
                      ? data.profile.notes
                      : "No notes added"}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <Separator />

          <DrawerFooter>
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
