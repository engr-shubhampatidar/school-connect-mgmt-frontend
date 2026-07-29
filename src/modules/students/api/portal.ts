import API from "@/services/axios";
import { STUDENT_API } from "@/config/api-routes";

export type StudentMe = Record<string, unknown>;

export type StudentAttendanceSummary = Record<string, unknown>;

export type StudentAttendancePage = {
  items: Array<Record<string, unknown>>;
  total: number;
};

export async function getStudentMe(): Promise<StudentMe> {
  const res = await API.get(STUDENT_API.ME);
  return (res.data ?? {}) as StudentMe;
}

export async function getStudentProfile(): Promise<StudentMe> {
  const res = await API.get(STUDENT_API.PROFILE);
  return (res.data ?? {}) as StudentMe;
}

export async function getAttendanceSummary(): Promise<StudentAttendanceSummary> {
  const res = await API.get(STUDENT_API.ATTENDANCE);
  return (res.data ?? {}) as StudentAttendanceSummary;
}

export async function getAttendanceHistory(
  page = 1,
  limit = 10,
): Promise<StudentAttendancePage> {
  const res = await API.get(STUDENT_API.ATTENDANCE, {
    params: { page, limit },
  });
  const data = res.data ?? {};
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
      ? data.items
      : [];
  const total =
    typeof data.total === "number"
      ? data.total
      : Array.isArray(data)
        ? data.length
        : items.length;
  return { items, total };
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<unknown> {
  const res = await API.post(STUDENT_API.CHANGE_PASSWORD, payload);
  return res.data;
}

const studentApi = {
  getStudentMe,
  getStudentProfile,
  getAttendanceSummary,
  getAttendanceHistory,
  changePassword,
};

export default studentApi;
