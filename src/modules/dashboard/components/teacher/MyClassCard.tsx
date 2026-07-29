"use client";

import { Card } from "@/components/ui/Card";
import WarningIcon from "./WarningIcon";

type MyClassCardProps = {
  hasClass: boolean;
  classLabel: string | null;
  room?: string | null;
  totalStudents: number;
  attendanceDone: boolean;
  onTakeAttendance: () => void;
};

export default function MyClassCard({
  hasClass,
  classLabel,
  room,
  totalStudents,
  attendanceDone,
  onTakeAttendance,
}: MyClassCardProps) {
  if (!hasClass) {
    return (
      <Card>
        <h3 className="text-lg font-medium">No class assigned</h3>
        <p className="text-sm text-slate-600">
          You are not a class teacher of any class.
        </p>
      </Card>
    );
  }

  return (
    <div className="bg-[#FFFFFF] rounded-[8px] border border-[#D7E3FC]">
      <div className="flex items-start justify-between px-6 py-6">
        <div>
          <div className="text-[24px] text-[#021034] font-semibold">
            My Class: {classLabel}
          </div>
          <div className="mt-1 text-[14px] text-[#737373] font-[400]">
            Class Teacher Responsibilities
            {room ? ` · Room ${room}` : ""}
          </div>
        </div>

        <div className="flex flex-col text-right text-[14px] text-[#737373] font-[400]">
          <span className="mt-1 text-[24px] text-[#021034] font-semibold">
            {totalStudents}
          </span>
          Total Students
        </div>
      </div>

      <div className="rounded-b-md border-t-2 border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!attendanceDone && (
            <div className="text-amber-600">
              <WarningIcon />
            </div>
          )}
          <div className="text-[14px] text-[#737373] font-[600]">
            {attendanceDone
              ? "Today's attendance has been submitted."
              : "Today's attendance not yet submitted."}
          </div>
        </div>
        {!attendanceDone && (
          <button
            onClick={onTakeAttendance}
            className="inline-flex items-center gap-2 bg-[#021034] text-white px-4 py-2 rounded-md shadow-sm cursor-pointer hover:bg-[#021034]/90 transition"
          >
            <span>+ Take Attendance</span>
          </button>
        )}
      </div>
    </div>
  );
}
