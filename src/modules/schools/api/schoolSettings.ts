import API from "@/services/axios";
import { ADMIN_API } from "@/config/api-routes";

export type SchoolLocation = {
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
  attendanceGeofenceRadiusMeters?: number | null;
  isConfigured: boolean;
};

export type SchoolSettings = {
  academicYear?: string;
  timezone?: string;
  notificationPreferences?: Record<string, unknown>;
  schoolLogoUrl?: string;
  location?: SchoolLocation;
};

export type UpdateSchoolLocationPayload = {
  latitude: number;
  longitude: number;
  locationName?: string;
  attendanceGeofenceRadiusMeters?: number;
};

export async function fetchSchoolSettings(): Promise<SchoolSettings> {
  const res = await API.get<SchoolSettings>(ADMIN_API.SCHOOL_SETTINGS);
  return res.data ?? {};
}

export async function updateSchoolLocation(
  payload: UpdateSchoolLocationPayload,
): Promise<SchoolLocation> {
  const res = await API.put<SchoolLocation>(
    ADMIN_API.SCHOOL_LOCATION,
    payload,
  );
  return res.data;
}
