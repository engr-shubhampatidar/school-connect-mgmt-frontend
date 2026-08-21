import API from "@/services/axios";
import { TEACHER_API } from "@/config/api-routes";

export type TeacherAttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "HALF_DAY"
  | "ABSENT"
  | "LEAVE"
  | "HOLIDAY";

export type TeacherAttendanceContext = {
  school: {
    latitude: number | string;
    longitude: number | string;
    locationName: string;
    attendanceGeofenceRadiusMeters: number;
    isConfigured: boolean;
  };
  profile: {
    name: string;
    email: string;
    mobile: string;
    address: string;
  };
  todayAttendance: {
    status: TeacherAttendanceStatus;
    attendanceId: string;
    attendanceDate: string;
    checkInTime: string;
    checkOutTime: string;
    checkInLatitude: number | string;
    checkInLongitude: number | string;
    checkInAddress: string;
    checkOutLatitude: number | string;
    checkOutLongitude: number | string;
    checkOutAddress: string;
    workingMinutes: number;
    remarks: string;
  };
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type CheckInOutPayload = {
  latitude: number;
  longitude: number;
  address?: string;
};

export async function fetchTeacherAttendanceContext(): Promise<TeacherAttendanceContext> {
  const res = await API.get<ApiEnvelope<TeacherAttendanceContext>>(
    TEACHER_API.ATTENDANCE_CONTEXT,
  );
  if (!res.data?.data) {
    throw new Error("Unable to load teacher attendance context");
  }
  return res.data.data;
}

export async function teacherCheckIn(payload: CheckInOutPayload) {
  const res = await API.post<ApiEnvelope<unknown>>(TEACHER_API.CHECK_IN, payload);
  return res.data;
}

export async function teacherCheckOut(payload: CheckInOutPayload) {
  const res = await API.post<ApiEnvelope<unknown>>(TEACHER_API.CHECK_OUT, payload);
  return res.data;
}

export function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => reject(new Error("Unable to detect your current location.")),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });
}
