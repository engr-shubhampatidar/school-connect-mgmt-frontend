"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";
import {
  ensureSessionReady,
  getAccessToken,
  getActiveRole,
} from "@/modules/auth";
import {
  allocateTeacherLeave,
  fetchTeacherLeaveAllocations,
} from "../api/leave";
import { allocatedUsedRemaining } from "../utils";
import type { TeacherLeaveBalance, TeacherLeaveBalanceList } from "../types";

export function AdminLeaveAllocation() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TeacherLeaveBalanceList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<TeacherLeaveBalance | null>(null);
  const [casualLeave, setCasualLeave] = useState("0");
  const [sickLeave, setSickLeave] = useState("0");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    await ensureSessionReady();
    if (!getAccessToken() || getActiveRole() !== "admin") {
      setLoading(false);
      return;
    }
    try {
      const result = await fetchTeacherLeaveAllocations({
        search: appliedSearch || undefined,
        page,
        limit: 10,
      });
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to load leave allocations";
      setError(message);
      toast({
        title: "Unable to load leave allocations",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, page, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const openEdit = (row: TeacherLeaveBalance) => {
    const casual = allocatedUsedRemaining(row.balances, "CASUAL");
    const sick = allocatedUsedRemaining(row.balances, "SICK");
    setEditing(row);
    setCasualLeave(String(casual.allocatedDays));
    setSickLeave(String(sick.allocatedDays));
  };

  const handleSave = async () => {
    if (!editing) return;
    const teacherId = editing.teacherProfileId || editing.teacherId;
    const casual = Number(casualLeave);
    const sick = Number(sickLeave);
    if (!Number.isInteger(casual) || casual < 0 || !Number.isInteger(sick) || sick < 0) {
      toast({
        title: "Enter whole numbers of 0 or more",
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const updated = await allocateTeacherLeave(teacherId, {
        casualLeave: casual,
        sickLeave: sick,
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.teacherId === updated.teacherId ||
                item.teacherProfileId === updated.teacherProfileId
                  ? updated
                  : item,
              ),
            }
          : prev,
      );
      setEditing(null);
      toast({ title: "Leave allocation updated", type: "success" });
    } catch (err: unknown) {
      toast({
        title: "Unable to update allocation",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setAppliedSearch(search.trim());
        }}
      >
        <Input
          className="max-w-sm"
          placeholder="Search teacher"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button type="submit" variant="dark">
          Search
        </Button>
      </form>

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
                  <th className="px-4 py-3 font-medium">Employee ID</th>
                  <th className="px-4 py-3 font-medium">CL remaining</th>
                  <th className="px-4 py-3 font-medium">SL remaining</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      No teachers found.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => {
                    const casual = allocatedUsedRemaining(row.balances, "CASUAL");
                    const sick = allocatedUsedRemaining(row.balances, "SICK");
                    return (
                      <tr
                        key={row.teacherProfileId || row.teacherId}
                        className="border-t border-[#F1F5F9]"
                      >
                        <td className="px-4 py-3">{row.teacherName || "—"}</td>
                        <td className="px-4 py-3">{row.employeeId || "—"}</td>
                        <td className="px-4 py-3">
                          {casual.remainingDays} / {casual.allocatedDays}
                        </td>
                        <td className="px-4 py-3">
                          {sick.remainingDays} / {sick.allocatedDays}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" onClick={() => openEdit(row)}>
                            Allocate
                          </Button>
                        </td>
                      </tr>
                    );
                  })
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

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEditing(null)}
          />
          <div className="relative w-full max-w-md rounded-lg bg-white p-4">
            <h3 className="text-lg font-semibold text-[#1B263B]">
              Allocate leave
            </h3>
            <p className="mt-1 text-sm text-slate-600">{editing.teacherName}</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm">
                Casual Leave (allocated days)
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  step={1}
                  value={casualLeave}
                  onChange={(event) => setCasualLeave(event.target.value)}
                />
              </label>
              <label className="text-sm">
                Sick Leave (allocated days)
                <Input
                  className="mt-1"
                  type="number"
                  min={0}
                  step={1}
                  value={sickLeave}
                  onChange={(event) => setSickLeave(event.target.value)}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="dark" disabled={saving} onClick={() => void handleSave()}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
