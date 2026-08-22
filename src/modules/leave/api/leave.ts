import { ADMIN_API, TEACHER_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  AllocateLeavePayload,
  CreateLeavePayload,
  LeaveDetail,
  LeaveListQuery,
  LeaveListResponse,
  TeacherLeaveBalance,
  TeacherLeaveBalanceList,
} from "../types";

function apiMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.filter(Boolean).join(", ");
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function fetchTeacherLeaveBalances(): Promise<TeacherLeaveBalance> {
  try {
    const res = await API.get<TeacherLeaveBalance>(TEACHER_API.LEAVE_BALANCES);
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to load leave balances"));
  }
}

export async function fetchTeacherLeaves(
  query: LeaveListQuery = {},
): Promise<LeaveListResponse> {
  try {
    const res = await API.get<LeaveListResponse>(TEACHER_API.LEAVES, {
      params: query,
    });
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to load leave history"));
  }
}

export async function applyTeacherLeave(
  payload: CreateLeavePayload,
): Promise<LeaveDetail> {
  try {
    const res = await API.post<LeaveDetail>(TEACHER_API.LEAVES, payload);
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to apply for leave"));
  }
}

export async function fetchAdminTeacherLeaves(
  query: LeaveListQuery = {},
): Promise<LeaveListResponse> {
  try {
    const res = await API.get<LeaveListResponse>(ADMIN_API.TEACHER_LEAVES, {
      params: query,
    });
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to load teacher leave requests"));
  }
}

export async function approveTeacherLeave(id: string): Promise<LeaveDetail> {
  try {
    const res = await API.patch<LeaveDetail>(ADMIN_API.TEACHER_LEAVE_APPROVE(id));
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to approve leave"));
  }
}

export async function rejectTeacherLeave(
  id: string,
  rejectionReason: string,
): Promise<LeaveDetail> {
  try {
    const res = await API.patch<LeaveDetail>(ADMIN_API.TEACHER_LEAVE_REJECT(id), {
      rejectionReason,
    });
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to reject leave"));
  }
}

export async function fetchTeacherLeaveAllocations(query: {
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<TeacherLeaveBalanceList> {
  try {
    const res = await API.get<TeacherLeaveBalanceList>(
      ADMIN_API.TEACHER_LEAVE_ALLOCATIONS,
      { params: query },
    );
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to load leave allocations"));
  }
}

export async function allocateTeacherLeave(
  teacherId: string,
  payload: AllocateLeavePayload,
): Promise<TeacherLeaveBalance> {
  try {
    const res = await API.put<TeacherLeaveBalance>(
      ADMIN_API.TEACHER_LEAVE_ALLOCATION(teacherId),
      payload,
    );
    return res.data;
  } catch (error) {
    throw new Error(apiMessage(error, "Unable to update leave allocation"));
  }
}
