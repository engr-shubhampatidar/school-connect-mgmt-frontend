"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  TEACHER_LEAVE_TYPE_OPTIONS,
  countInclusiveDays,
  remainingForType,
} from "../utils";
import type { CreateLeavePayload, LeaveBalanceItem, TeacherLeaveType } from "../types";

type Props = {
  balances?: LeaveBalanceItem[];
  submitting?: boolean;
  onSubmit: (payload: CreateLeavePayload) => Promise<void>;
};

export function ApplyLeaveForm({ balances, submitting, onSubmit }: Props) {
  const [leaveType, setLeaveType] = useState<TeacherLeaveType>("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(
    () => countInclusiveDays(startDate, endDate),
    [startDate, endDate],
  );
  const remaining = remainingForType(balances, leaveType);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError("Select a start and end date.");
      return;
    }
    if (days < 1) {
      setError("End date cannot be before start date.");
      return;
    }
    if (!reason.trim()) {
      setError("Enter a reason for leave.");
      return;
    }
    if (days > remaining) {
      setError(`Only ${remaining} ${leaveType === "CASUAL" ? "CL" : "SL"} day(s) remaining.`);
      return;
    }

    try {
      await onSubmit({
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      });
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch {
      // Parent surfaces the API error.
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-[#1B263B]">Apply for leave</h2>
      <p className="mt-1 text-sm text-[#415A77]">
        Balance is checked now and deducted only after admin approval.
      </p>
      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="text-sm">
          Leave type
          <Select
            className="mt-1 w-full bg-transparent border border-[#D7E3FC]"
            options={TEACHER_LEAVE_TYPE_OPTIONS}
            value={leaveType}
            onChange={(value) => setLeaveType(value as TeacherLeaveType)}
          />
        </label>
        <div className="text-sm text-slate-600 self-end">
          Remaining: <span className="font-medium text-[#021034]">{remaining} day(s)</span>
          {days > 0 ? ` · Requesting ${days}` : ""}
        </div>
        <label className="text-sm">
          Start date
          <Input
            className="mt-1"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <label className="text-sm">
          End date
          <Input
            className="mt-1"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Reason
          <Textarea
            className="mt-1"
            rows={3}
            maxLength={1000}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason for leave"
          />
        </label>
        {error ? (
          <p className="sm:col-span-2 text-sm text-red-600">{error}</p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" variant="dark" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit request"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
