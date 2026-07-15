"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/axios";
import type { ClassSubjectAllocation } from "./SubjectAllocationTable";
import type { ClassTimetableEntry } from "./TimetableList";
import ClassOverview from "./ClassOverview";

export default function ClassOverviewContainer() {
  const params = useParams();
  const clsId = Array.isArray(params?.clsId) ? params?.clsId[0] : params?.clsId;

  const [items, setItems] = useState<ClassSubjectAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timetableItems, setTimetableItems] = useState<ClassTimetableEntry[]>(
    []
  );
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(true);
  const [timetableError, setTimetableError] = useState<string | null>(null);

  // Class details
  const [details, setDetails] = useState<{
    id: string;
    className: string;
    section: string;
    classTeacherName: string | null;
    totalStudents: number;
  } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    if (!clsId) {
      setItems([]);
      setIsLoading(false);
      setError("Missing class id");
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setError(null);

    API.get(`/api/admin/classes/${clsId}/subjects`)
      .then((res) => {
        if (!mounted) return;
        setItems(res.data ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load subjects. Please try again.");
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [clsId]);

  const reloadSubjects = async () => {
    if (!clsId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await API.get(`/api/admin/classes/${clsId}/subjects`);
      setItems(res.data ?? []);
    } catch (e) {
      setError("Failed to load subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!clsId) {
      setDetails(null);
      setIsLoadingDetails(false);
      setDetailsError("Missing class id");
      return;
    }

    let mounted = true;
    setIsLoadingDetails(true);
    setDetailsError(null);

    API.get(`/api/admin/classes/${clsId}/details`)
      .then((res) => {
        if (!mounted) return;
        setDetails(res.data ?? null);
        if (res.data && typeof document !== "undefined") {
          try {
            document.title = `Class ${res.data.className} – Section ${res.data.section}`;
          } catch {}
        }
      })
      .catch(() => {
        if (!mounted) return;
        setDetailsError("Failed to load class details. Please try again.");
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingDetails(false);
      });

    return () => {
      mounted = false;
    };
  }, [clsId]);

  const reloadDetails = async () => {
    if (!clsId) return;
    setIsLoadingDetails(true);
    setDetailsError(null);
    try {
      const res = await API.get(`/api/admin/classes/${clsId}/details`);
      setDetails(res.data ?? null);
    } catch {
      setDetailsError("Failed to load class details. Please try again.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (!clsId) {
      setTimetableItems([]);
      setIsLoadingTimetable(false);
      setTimetableError("Missing class id");
      return;
    }

    let mounted = true;
    setIsLoadingTimetable(true);
    setTimetableError(null);

    API.get(`/api/admin/classes/${clsId}/timetable`)
      .then((res) => {
        if (!mounted) return;
        setTimetableItems(res.data ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setTimetableError("Failed to load timetable. Please try again.");
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingTimetable(false);
      });

    return () => {
      mounted = false;
    };
  }, [clsId]);

  return (
    <ClassOverview
      subjects={items}
      isLoading={isLoading}
      error={error}
      timetableItems={timetableItems}
      isLoadingTimetable={isLoadingTimetable}
      timetableError={timetableError}
      selectedDay={new Date().getDay()}
      details={details}
      isLoadingDetails={isLoadingDetails}
      detailsError={detailsError}
      onReloadSubjects={reloadSubjects}
      onReloadDetails={reloadDetails}
    />
  );
}
