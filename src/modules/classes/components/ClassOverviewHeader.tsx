"use client";

import React, { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import { Button } from "@/components/ui";
import EditClassDialog from "./EditClassDialog";
import type { ClassDashboardDetails } from "@/modules/classes/types/classes";

export type { ClassDashboardDetails };

interface Props {
  data?: ClassDashboardDetails | null;
  isLoading: boolean;
  error?: string | null;
  onUpdated?: () => void;
}

export default function ClassOverviewHeader({
  data,
  isLoading,
  error,
  onUpdated,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const title = data
    ? `Class ${data.className} – Section ${data.section}`
    : "Class";

  return (
    <>
      <div className="mb-6 bg-white rounded-lg border border-[#D7E3FC] ">
        {error ? <div className="text-sm text-rose-600">{error}</div> : null}

        <div className="mb-4 border-b border-[#D7E3FC] flex justify-between p-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {isLoading ? (
                <div className="h-6 w-64 bg-slate-200 rounded animate-pulse" />
              ) : (
                title
              )}
            </h2>
            <div className="text-sm text-slate-600 mt-1">
              {isLoading ? (
                <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              ) : (
                `Academic Year: 2026-27`
              )}
            </div>
          </div>
          <div>
            <Button
              variant="dark"
              className="mt-3"
              onClick={() => setEditOpen(true)}
              disabled={!data?.id || isLoading}
            >
              Edit Class Details
            </Button>
          </div>
        </div>
        <div className="flex items-start justify-between p-4">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
            ) : (
              <Avatar name={data?.classTeacherName ?? undefined} size={40} />
            )}

            <div className="text-right">
              <div className="text-[#737373] text-[12px] font-[400]">
                Class Teacher
              </div>
              <div className="text-[#021034] text-[14px] font-[500] text-left">
                {isLoading ? (
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse inline-block" />
                ) : (
                  data?.classTeacherName ?? "Not Assigned"
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="text-[#737373] text-[12px] font-[400]">Total Student</p>
            <p className="text-[#021034] text-[14px] font-[500]">
              {isLoading ? (
                <span className="inline-block h-4 w-16 bg-slate-200 rounded animate-pulse" />
              ) : (
                `${data?.totalStudents ?? 0} Student`
              )}
            </p>
          </div>
          <div>
            <p className="text-[#737373] text-[12px] font-[400]">Room No.</p>
            <p className="text-[#021034] text-[14px] font-[500]">
              {isLoading ? (
                <span className="inline-block h-4 w-24 bg-slate-200 rounded animate-pulse" />
              ) : (
                data?.roomNo ?? "—"
              )}
            </p>
          </div>

          <div className="pl-4 border-l border-slate-100">
            <div className="text-sm text-slate-600">Total Students</div>
            <div className="text-xl font-semibold">
              {isLoading ? (
                <div className="h-6 w-12 bg-slate-200 rounded animate-pulse" />
              ) : (
                data?.totalStudents
              )}
            </div>
          </div>
        </div>
      </div>

      <EditClassDialog
        open={editOpen}
        classId={data?.id ?? null}
        onClose={() => setEditOpen(false)}
        onUpdated={onUpdated}
      />
    </>
  );
}
