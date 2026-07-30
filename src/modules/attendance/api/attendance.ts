import API from "@/services/axios";
import { ATTENDANCE_API } from "@/config/api-routes";

export async function fetchAttendanceForClassDate(
  classId: string,
  date: string,
): Promise<unknown> {
  const res = await API.get<unknown>(ATTENDANCE_API.BASE, {
    params: { classId, date },
  });
  return res.data;
}

export async function fetchAttendanceByClass(
  classId: string,
  params?: { startDate?: string; endDate?: string },
): Promise<unknown> {
  const res = await API.get<unknown>(ATTENDANCE_API.CLASS(classId), {
    params,
  });
  return res.data;
}

export async function markAttendance(payload: {
  classId: string;
  date: string;
  students: Array<{ studentId: string; status: string }>;
}): Promise<unknown> {
  const res = await API.post<unknown>(ATTENDANCE_API.BASE, payload);
  return res.data;
}
