"use client";

import { useEffect, useState } from "react";
import {
  AssignedSubjectsCard,
  mapAssignedSubjects,
  TeacherSubjectsPageSkeleton,
  getTeacherDashboard,
} from "@/modules/teachers";
import { ensureSessionReady, getAccessToken, getActiveRole } from "@/modules/auth";

export default function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState(
    [] as ReturnType<typeof mapAssignedSubjects>,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      await ensureSessionReady();
      if (!mounted) return;
      if (!getAccessToken() || getActiveRole() !== "teacher") {
        setLoading(false);
        return;
      }
      try {
        const data = await getTeacherDashboard();
        if (!mounted) return;
        setSubjects(mapAssignedSubjects(data.assignedSubjects ?? []));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <TeacherSubjectsPageSkeleton />;
  }

  return (
    <div className="p-6">
      <AssignedSubjectsCard subjects={subjects} showFilters />
    </div>
  );
}
