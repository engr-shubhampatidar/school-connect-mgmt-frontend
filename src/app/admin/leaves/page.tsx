"use client";

import { AdminLeaveApprovals, AdminLeaveSubnav } from "@/modules/leave";

export default function AdminTeacherLeavesPage() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B263B]">Teacher Leaves</h1>
        <p className="mt-1 text-sm text-[#415A77]">
          Review and approve pending casual and sick leave requests.
        </p>
      </div>
      <AdminLeaveSubnav />
      <AdminLeaveApprovals />
    </div>
  );
}
