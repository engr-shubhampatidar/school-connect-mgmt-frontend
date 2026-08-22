"use client";

import { AdminLeaveAllocation, AdminLeaveSubnav } from "@/modules/leave";

export default function AdminTeacherLeaveAllocationPage() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B263B]">
          Leave Allocation
        </h1>
        <p className="mt-1 text-sm text-[#415A77]">
          Set available casual leave and sick leave for each teacher.
        </p>
      </div>
      <AdminLeaveSubnav />
      <AdminLeaveAllocation />
    </div>
  );
}
