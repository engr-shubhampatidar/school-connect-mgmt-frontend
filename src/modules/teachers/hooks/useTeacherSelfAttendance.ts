"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthenticatedLoad } from "@/hooks/useAuthenticatedLoad";
import {
  fetchTeacherAttendanceContext,
  getCurrentPosition,
  teacherCheckIn,
  teacherCheckOut,
  type TeacherAttendanceContext,
} from "../api/teacherAttendance";

export function useTeacherSelfAttendance() {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState(false);

  const loadContext = useCallback(async () => fetchTeacherAttendanceContext(), []);

  const { data, setData, loading, error, } = useAuthenticatedLoad<TeacherAttendanceContext>(
    "teacher",
    loadContext,
    { errorTitle: "Unable to load attendance" },
  );

  const refresh = useCallback(async () => {
    const next = await fetchTeacherAttendanceContext();
    setData(next);
    return next;
  }, [setData]);

  const performCheckIn = useCallback(async () => {
    if (!data?.school.isConfigured) {
      throw new Error("School location is not configured yet.");
    }

    setActionLoading(true);
    try {
      const coords = await getCurrentPosition();
      await teacherCheckIn({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      await refresh();
      toast({
        title: "Check-in successful",
        description: "Your attendance has been marked for today.",
        type: "success",
      });
    } finally {
      setActionLoading(false);
    }
  }, [data?.school.isConfigured, refresh, toast]);

  const performCheckOut = useCallback(async () => {
    if (!data?.school.isConfigured) {
      throw new Error("School location is not configured yet.");
    }

    setActionLoading(true);
    try {
      const coords = await getCurrentPosition();
      await teacherCheckOut({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      await refresh();
      toast({
        title: "Check-out successful",
        description: "Your check-out has been recorded.",
        type: "success",
      });
    } finally {
      setActionLoading(false);
    }
  }, [data?.school.isConfigured, refresh, toast]);

  return {
    data,
    loading,
    error,
    actionLoading,
    performCheckIn,
    performCheckOut,
    refresh,
  };
}
