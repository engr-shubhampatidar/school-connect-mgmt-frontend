"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthenticatedLoad } from "@/hooks/useAuthenticatedLoad";
import {
  ApplyLeaveForm,
  LeaveBalanceCards,
  LeaveHistoryTable,
  applyTeacherLeave,
  fetchTeacherLeaves,
} from "@/modules/leave";
import type { LeaveBalanceItem } from "@/modules/leave";

export default function TeacherLeavesPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const loadHistory = useCallback(
    () => fetchTeacherLeaves({ page: 1, limit: 20 }),
    [],
  );

  const historyState = useAuthenticatedLoad("teacher", loadHistory, {
    errorTitle: "Unable to load leave history",
  });

  const balances: LeaveBalanceItem[] = [
    {
      leaveType: "CASUAL",
      allocatedDays: 0,
      usedDays: 0,
      remainingDays: historyState.data?.casualLeave ?? 0,
    },
    {
      leaveType: "SICK",
      allocatedDays: 0,
      usedDays: 0,
      remainingDays: historyState.data?.sickLeave ?? 0,
    },
  ];

  const handleApply = async (payload: {
    leaveType: "CASUAL" | "SICK";
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    setSubmitting(true);
    try {
      await applyTeacherLeave(payload);
      toast({ title: "Leave request submitted", type: "success" });
      historyState.setData(await fetchTeacherLeaves({ page: 1, limit: 20 }));
    } catch (err: unknown) {
      toast({
        title: "Unable to apply for leave",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (historyState.loading && !historyState.data) {
    return (
      <div className="p-4">
        <div className="h-56 animate-pulse rounded-lg bg-[#EEF4FF]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B263B]">My Leaves</h1>
        <p className="mt-1 text-sm text-[#415A77]">
          View CL/SL balances, apply for leave, and track request status.
        </p>
      </div>

      {historyState.error ? (
        <p className="text-sm text-red-600">{historyState.error}</p>
      ) : null}

      <LeaveBalanceCards
        casualLeave={historyState.data?.casualLeave}
        sickLeave={historyState.data?.sickLeave}
        totalUsedLeaves={historyState.data?.totalUsedLeaves}
      />
      <ApplyLeaveForm
        balances={balances}
        submitting={submitting}
        onSubmit={handleApply}
      />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[#1B263B]">
          Leave history
        </h2>
        <LeaveHistoryTable items={historyState.data?.items ?? []} />
      </div>
    </div>
  );
}
