"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  ensureSessionReady,
  getAccessToken,
  getActiveRole,
} from "@/modules/auth";
import {
  approveTeacherLeave,
  fetchAdminTeacherLeaves,
  rejectTeacherLeave,
} from "../api/leave";
import { LEAVE_TYPE_LABELS, formatLeaveDate } from "../utils";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import type { LeaveListResponse, LeaveStatus, LeaveSummary } from "../types";

export function AdminLeaveApprovals() {
  const { toast } = useToast();
  const [status, setStatus] = useState<LeaveStatus | "">("PENDING");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeaveListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<LeaveSummary | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    await ensureSessionReady();
    if (!getAccessToken() || getActiveRole() !== "admin") {
      setLoading(false);
      return;
    }
    try {
      const result = await fetchAdminTeacherLeaves({
        status: status || undefined,
        page,
        limit: 10,
      });
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to load teacher leaves";
      setError(message);
      toast({
        title: "Unable to load teacher leaves",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [status, page, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const refreshRow = (updated: LeaveSummary) => {
    setData((prev) => {
      if (!prev) return prev;
      if (status && updated.status !== status) {
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== updated.id),
          total: Math.max(0, prev.total - 1),
        };
      }
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item,
        ),
      };
    });
  };

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await approveTeacherLeave(id);
      refreshRow(updated);
      toast({ title: "Leave approved", type: "success" });
    } catch (err: unknown) {
      toast({
        title: "Unable to approve leave",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejecting) return;
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        type: "error",
      });
      return;
    }
    setBusyId(rejecting.id);
    try {
      const updated = await rejectTeacherLeave(
        rejecting.id,
        rejectionReason.trim(),
      );
      refreshRow(updated);
      setRejecting(null);
      setRejectionReason("");
      toast({ title: "Leave rejected", type: "success" });
    } catch (err: unknown) {
      toast({
        title: "Unable to reject leave",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["PENDING", "APPROVED", "REJECTED", ""] as const).map((value) => (
          <Button
            key={value || "all"}
            variant={status === value ? "dark" : "ghost"}
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
          >
            {value ? value[0] + value.slice(1).toLowerCase() : "All"}
          </Button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Card className="p-0 overflow-hidden">
        {loading && !data ? (
          <div className="h-40 animate-pulse bg-[#EEF4FF]" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-left text-[#415A77]">
                <tr>
                  <th className="px-4 py-3 font-medium">Teacher</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      No teacher leave requests.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id} className="border-t border-[#F1F5F9]">
                      <td className="px-4 py-3">{row.applicantName || "—"}</td>
                      <td className="px-4 py-3">
                        {LEAVE_TYPE_LABELS[row.leaveType] ?? row.leaveType}
                      </td>
                      <td className="px-4 py-3">
                        {formatLeaveDate(row.startDate)} –{" "}
                        {formatLeaveDate(row.endDate)}
                      </td>
                      <td className="px-4 py-3">
                        <LeaveStatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3">
                        {row.status === "PENDING" ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="dark"
                              disabled={busyId === row.id}
                              onClick={() => handleApprove(row.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              disabled={busyId === row.id}
                              onClick={() => {
                                setRejecting(row);
                                setRejectionReason("");
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {page} of {totalPages} · {data?.total ?? 0} total
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {rejecting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setRejecting(null)}
          />
          <div className="relative w-full max-w-md rounded-lg bg-white p-4">
            <h3 className="text-lg font-semibold text-[#1B263B]">
              Reject leave
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {rejecting.applicantName} · {LEAVE_TYPE_LABELS[rejecting.leaveType]}
            </p>
            <Textarea
              className="mt-3"
              rows={4}
              maxLength={500}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Reason for rejection"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRejecting(null)}>
                Cancel
              </Button>
              <Button
                variant="dark"
                disabled={busyId === rejecting.id}
                onClick={() => void handleReject()}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
