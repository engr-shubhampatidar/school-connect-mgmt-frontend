"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchChildAnnouncements,
  fetchChildAttendance,
  fetchChildClass,
  fetchChildDashboard,
  fetchChildDocuments,
  fetchChildExamResults,
  fetchChildExamSchedule,
  fetchChildFeePayments,
  fetchChildFees,
  fetchChildFeesSummary,
  fetchChildHomework,
  fetchChildHomeworkDetail,
  fetchChildMonthlyAttendance,
  fetchChildProfile,
  fetchChildReportCard,
  fetchChildTimetable,
  fetchParentChildren,
  fetchParentMe,
} from "@/modules/parent-portal/api/parentPortal";
import {
  PARENT_PORTAL_PAGE_SIZE,
  parentPortalQueryKeys,
} from "@/modules/parent-portal/constants/query-keys";
import type { HomeworkQuery } from "@/modules/parent-portal/types";

export function useParentMeQuery() {
  return useQuery({
    queryKey: parentPortalQueryKeys.me(),
    queryFn: fetchParentMe,
  });
}

export function useParentChildrenQuery() {
  return useQuery({
    queryKey: parentPortalQueryKeys.children(),
    queryFn: fetchParentChildren,
  });
}

export function useChildDashboardQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.dashboard(studentId ?? ""),
    queryFn: () => fetchChildDashboard(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildProfileQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.profile(studentId ?? ""),
    queryFn: () => fetchChildProfile(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildAttendanceQuery(
  studentId: string | undefined,
  params?: { from?: string; to?: string },
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.attendance(studentId ?? "", params),
    queryFn: () => fetchChildAttendance(studentId!, params),
    enabled: Boolean(studentId),
  });
}

export function useChildMonthlyAttendanceQuery(
  studentId: string | undefined,
  params?: { year?: number; month?: number },
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.attendanceMonthly(studentId ?? "", params),
    queryFn: () => fetchChildMonthlyAttendance(studentId!, params),
    enabled: Boolean(studentId),
  });
}

export function useChildClassQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.classInfo(studentId ?? ""),
    queryFn: () => fetchChildClass(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildTimetableQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.timetable(studentId ?? ""),
    queryFn: () => fetchChildTimetable(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildAnnouncementsQuery(
  studentId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.announcements(studentId ?? "", params),
    queryFn: () => fetchChildAnnouncements(studentId!, params),
    enabled: Boolean(studentId),
  });
}

export function useChildDocumentsQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.documents(studentId ?? ""),
    queryFn: () => fetchChildDocuments(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildHomeworkQuery(
  studentId: string | undefined,
  query: HomeworkQuery = {},
) {
  const q = { page: 1, limit: PARENT_PORTAL_PAGE_SIZE, ...query };
  return useQuery({
    queryKey: parentPortalQueryKeys.homework(studentId ?? "", q),
    queryFn: () => fetchChildHomework(studentId!, q),
    enabled: Boolean(studentId),
  });
}

export function useChildHomeworkDetailQuery(
  studentId: string | undefined,
  homeworkId: string | undefined,
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.homeworkDetail(
      studentId ?? "",
      homeworkId ?? "",
    ),
    queryFn: () => fetchChildHomeworkDetail(studentId!, homeworkId!),
    enabled: Boolean(studentId && homeworkId),
  });
}

export function useChildFeesQuery(
  studentId: string | undefined,
  params?: { page?: number; limit?: number; status?: string },
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.fees(studentId ?? "", params),
    queryFn: () => fetchChildFees(studentId!, params),
    enabled: Boolean(studentId),
  });
}

export function useChildFeesSummaryQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.feesSummary(studentId ?? ""),
    queryFn: () => fetchChildFeesSummary(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildFeePaymentsQuery(
  studentId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.feePayments(studentId ?? "", params),
    queryFn: () => fetchChildFeePayments(studentId!, params),
    enabled: Boolean(studentId),
  });
}

export function useChildExamResultsQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.exams(studentId ?? ""),
    queryFn: () => fetchChildExamResults(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildExamScheduleQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: parentPortalQueryKeys.examSchedule(studentId ?? ""),
    queryFn: () => fetchChildExamSchedule(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useChildReportCardQuery(
  studentId: string | undefined,
  examId: string | undefined,
) {
  return useQuery({
    queryKey: parentPortalQueryKeys.reportCard(studentId ?? "", examId ?? ""),
    queryFn: () => fetchChildReportCard(studentId!, examId!),
    enabled: Boolean(studentId && examId),
  });
}
