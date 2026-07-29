import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type AdminDashboardResponse = {
  schoolId: string;
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  recentStudents: { id: string; name: string; createdAt: string }[];
};

export type AttendanceGraphPayload = Record<string, unknown>;

export type AttendanceGraphDataPoint = {
  month: string;
  value: number;
};

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const res = await API.get<AdminDashboardResponse>(ADMIN_API.DASHBOARD);
  return res.data;
}

export async function postAttendanceGraph(
  payload: AttendanceGraphPayload,
): Promise<AttendanceGraphDataPoint[] | Record<string, unknown>> {
  const res = await API.post(ADMIN_API.GRAPH, payload);
  return res.data;
}
