"use client";

import { useCallback } from "react";
import { useAuthenticatedLoad } from "@/hooks/useAuthenticatedLoad";
import {
  fetchSchoolSettings,
  SchoolLocationForm,
  type SchoolLocation,
} from "@/modules/schools";

export default function AdminSchoolSettingsPage() {
  const loadSettings = useCallback(async () => fetchSchoolSettings(), []);

  const { data, setData, loading, error } = useAuthenticatedLoad(
    "admin",
    loadSettings,
    { errorTitle: "Unable to load school settings" },
  );

  const handleSaved = (location: SchoolLocation) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            location,
          }
        : { location },
    );
  };

  if (loading && !data) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-48 rounded-lg bg-[#EEF4FF]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-[#1B263B]">School Settings</h1>
        <p className="text-sm text-[#415A77] mt-1">
          Configure school location for teacher attendance.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <SchoolLocationForm
        initialLocation={data?.location ?? null}
        onSaved={handleSaved}
      />
    </div>
  );
}
