"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ClassSubjectAllocation } from "./SubjectAllocationTable";
import ClassOverview from "./ClassOverview";
import { fetchClassDetails } from "@/modules/classes/api/classes";
import { fetchClassSubjects } from "@/modules/classes/api/classSubjects";
import { fetchTimetable, type ClassTimetableEntry } from "@/modules/timetable";
import type { ClassDashboardDetails } from "@/modules/classes/types/classes";
import { ClassOverviewSkeleton } from "./skeletons";

export default function ClassOverviewContainer() {
  const params = useParams();
  const clsId = Array.isArray(params?.clsId) ? params?.clsId[0] : params?.clsId;

  const [items, setItems] = useState<ClassSubjectAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timetableItems, setTimetableItems] = useState<ClassTimetableEntry[]>(
    [],
  );
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(true);
  const [timetableError, setTimetableError] = useState<string | null>(null);

  const [details, setDetails] = useState<ClassDashboardDetails | null>(null);
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

    fetchClassSubjects(clsId)
      .then((data) => {
        if (!mounted) return;
        setItems((data ?? []) as ClassSubjectAllocation[]);
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
      const data = await fetchClassSubjects(clsId);
      setItems((data ?? []) as ClassSubjectAllocation[]);
    } catch {
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

    fetchClassDetails(clsId)
      .then((data) => {
        if (!mounted) return;
        setDetails(data ?? null);
        if (data && typeof document !== "undefined") {
          try {
            document.title = `Class ${data.className} – Section ${data.section}`;
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
      const data = await fetchClassDetails(clsId);
      setDetails(data ?? null);
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

    fetchTimetable(clsId)
      .then((data) => {
        if (!mounted) return;
        setTimetableItems((data ?? []) as ClassTimetableEntry[]);
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

  if (isLoadingDetails && !details && !detailsError) {
    return <ClassOverviewSkeleton />;
  }

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
