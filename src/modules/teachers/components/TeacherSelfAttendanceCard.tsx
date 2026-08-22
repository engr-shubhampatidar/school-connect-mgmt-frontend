"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AttendanceStatusBadge from "@/modules/attendance/components/AttendanceStatusBadge";
import type { TeacherAttendanceContext } from "../api/teacherAttendance";

type TeacherSelfAttendanceCardProps = {
  context: TeacherAttendanceContext;
  actionLoading?: boolean;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
};

function formatTime(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function TeacherSelfAttendanceCard({
  context,
  actionLoading = false,
  onCheckIn,
  onCheckOut,
}: TeacherSelfAttendanceCardProps) {
  const { profile, school, todayAttendance, monthlyAttendance } = context;
  const hasCheckedIn = Boolean(todayAttendance.checkInTime);
  const hasCheckedOut = Boolean(todayAttendance.checkOutTime);
  const canCheckIn =
    school.isConfigured &&
    !hasCheckedIn &&
    todayAttendance.status !== "LEAVE";
  const canCheckOut = school.isConfigured && hasCheckedIn && !hasCheckedOut;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#1B263B]">
              {profile.name}
            </h2>
            <p className="text-sm text-[#415A77]">{profile.email}</p>
            {profile.mobile ? (
              <p className="text-sm text-[#415A77]">{profile.mobile}</p>
            ) : null}
          </div>
          <AttendanceStatusBadge status={todayAttendance.status} />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-[#1B263B]">
          School reference location
        </h3>
        {school.isConfigured ? (
          <div className="mt-3 space-y-1 text-sm text-[#415A77]">
            {school.locationName ? <p>{school.locationName}</p> : null}
            <p>
              {school.latitude}, {school.longitude}
            </p>
            <p>
              Allowed radius: {school.attendanceGeofenceRadiusMeters} meters
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-amber-700">
            School location is not configured yet. Ask your administrator to set
            it before you can check in.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-[#1B263B]">
          {monthlyAttendance?.month ?? "This month"}
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-semibold text-[#1B263B]">
              {monthlyAttendance?.present ?? 0}
            </p>
            <p className="text-xs text-[#415A77]">Present</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#1B263B]">
              {monthlyAttendance?.absent ?? 0}
            </p>
            <p className="text-xs text-[#415A77]">Absent</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#1B263B]">
              {monthlyAttendance?.leaves ?? 0}
            </p>
            <p className="text-xs text-[#415A77]">Leaves</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-[#1B263B]">
          Today&apos;s attendance
        </h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#415A77]">
          <p>Date: {todayAttendance.attendanceDate}</p>
          <p>Check-in: {formatTime(todayAttendance.checkInTime)}</p>
          <p>Check-out: {formatTime(todayAttendance.checkOutTime)}</p>
          <p>
            Working minutes: {todayAttendance.workingMinutes}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!canCheckIn || actionLoading}
            onClick={() => void onCheckIn()}
          >
            {actionLoading ? "Processing..." : "Check in"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!canCheckOut || actionLoading}
            onClick={() => void onCheckOut()}
          >
            Check out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default TeacherSelfAttendanceCard;
