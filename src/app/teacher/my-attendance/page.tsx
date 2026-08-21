"use client";

import { TeacherSelfAttendanceCard } from "@/modules/teachers/components/TeacherSelfAttendanceCard";
import { useTeacherSelfAttendance } from "@/modules/teachers/hooks/useTeacherSelfAttendance";
import { useToast } from "@/components/ui/use-toast";

export default function TeacherMyAttendancePage() {
  const { toast } = useToast();
  const { data, loading, error, actionLoading, performCheckIn, performCheckOut } =
    useTeacherSelfAttendance();

  const handleAction = async (action: "check-in" | "check-out") => {
    try {
      if (action === "check-in") {
        await performCheckIn();
      } else {
        await performCheckOut();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Attendance action failed";
      toast({
        title: "Unable to complete action",
        description: message,
        type: "error",
      });
    }
  };

  if (loading && !data) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-56 rounded-lg bg-[#EEF4FF]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B263B]">My Attendance</h1>
        <p className="text-sm text-[#415A77] mt-1">
          View today&apos;s status and check in or out using the school location.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {data ? (
        <TeacherSelfAttendanceCard
          context={data}
          actionLoading={actionLoading}
          onCheckIn={() => handleAction("check-in")}
          onCheckOut={() => handleAction("check-out")}
        />
      ) : null}
    </div>
  );
}
