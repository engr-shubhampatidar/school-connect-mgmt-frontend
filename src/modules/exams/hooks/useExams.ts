"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExam,
  createExamSchedule,
  deleteExam,
  deleteExamSchedule,
  fetchClassReport,
  fetchExam,
  fetchExamDashboard,
  fetchExamMarks,
  fetchExamResults,
  fetchExamSchedules,
  fetchExams,
  fetchMyExamResults,
  fetchMyExamSchedule,
  fetchMyReportCard,
  fetchReportCard,
  generateExamResults,
  publishExamResults,
  updateExam,
  updateExamStatus,
  upsertExamMarks,
} from "@/modules/exams/api/exams";
import {
  EXAMS_PAGE_SIZE,
  examQueryKeys,
} from "@/modules/exams/constants/query-keys";
import type {
  CreateExamPayload,
  CreateSchedulePayload,
  ExamStatus,
  UpsertMarkItem,
} from "@/modules/exams/types";

export function useExamDashboard() {
  return useQuery({
    queryKey: examQueryKeys.dashboard(),
    queryFn: fetchExamDashboard,
  });
}

export function useExams(
  query: {
    page?: number;
    limit?: number;
    search?: string;
    classId?: string;
    status?: string;
    academicYear?: string;
  } = {},
) {
  return useQuery({
    queryKey: examQueryKeys.list(query),
    queryFn: () =>
      fetchExams({
        page: query.page ?? 1,
        limit: query.limit ?? EXAMS_PAGE_SIZE,
        search: query.search,
        classId: query.classId,
        status: query.status,
        academicYear: query.academicYear,
      }),
  });
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: examQueryKeys.detail(examId),
    queryFn: () => fetchExam(examId),
    enabled: Boolean(examId),
  });
}

export function useExamSchedules(examId: string) {
  return useQuery({
    queryKey: examQueryKeys.schedules(examId),
    queryFn: () => fetchExamSchedules(examId),
    enabled: Boolean(examId),
  });
}

export function useExamMarks(examId: string) {
  return useQuery({
    queryKey: examQueryKeys.marks(examId),
    queryFn: () => fetchExamMarks(examId),
    enabled: Boolean(examId),
  });
}

export function useExamResults(
  examId: string,
  query: { page?: number; limit?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: examQueryKeys.results(examId, query),
    queryFn: () =>
      fetchExamResults(examId, {
        page: query.page ?? 1,
        limit: query.limit ?? EXAMS_PAGE_SIZE,
        search: query.search,
      }),
    enabled: Boolean(examId),
  });
}

export function useReportCard(examId: string, studentUserId: string) {
  return useQuery({
    queryKey: examQueryKeys.reportCard(examId, studentUserId),
    queryFn: () => fetchReportCard(examId, studentUserId),
    enabled: Boolean(examId && studentUserId),
  });
}

export function useClassReport(examId: string) {
  return useQuery({
    queryKey: examQueryKeys.classReport(examId),
    queryFn: () => fetchClassReport(examId),
    enabled: Boolean(examId),
  });
}

export function useMyExamResults() {
  return useQuery({
    queryKey: examQueryKeys.studentList(),
    queryFn: fetchMyExamResults,
  });
}

export function useMyExamSchedule() {
  return useQuery({
    queryKey: examQueryKeys.studentSchedule(),
    queryFn: fetchMyExamSchedule,
  });
}

export function useMyReportCard(examId: string) {
  return useQuery({
    queryKey: examQueryKeys.studentReportCard(examId),
    queryFn: () => fetchMyReportCard(examId),
    enabled: Boolean(examId),
  });
}

export function useExamMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: examQueryKeys.all });

  return {
    createExam: useMutation({
      mutationFn: (payload: CreateExamPayload) => createExam(payload),
      onSuccess: invalidate,
    }),
    updateExam: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<CreateExamPayload>;
      }) => updateExam(id, payload),
      onSuccess: invalidate,
    }),
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: ExamStatus }) =>
        updateExamStatus(id, status),
      onSuccess: invalidate,
    }),
    deleteExam: useMutation({
      mutationFn: (id: string) => deleteExam(id),
      onSuccess: invalidate,
    }),
    createSchedule: useMutation({
      mutationFn: ({
        examId,
        payload,
      }: {
        examId: string;
        payload: CreateSchedulePayload;
      }) => createExamSchedule(examId, payload),
      onSuccess: invalidate,
    }),
    deleteSchedule: useMutation({
      mutationFn: ({
        examId,
        scheduleId,
      }: {
        examId: string;
        scheduleId: string;
      }) => deleteExamSchedule(examId, scheduleId),
      onSuccess: invalidate,
    }),
    upsertMarks: useMutation({
      mutationFn: ({
        examId,
        marks,
      }: {
        examId: string;
        marks: UpsertMarkItem[];
      }) => upsertExamMarks(examId, marks),
      onSuccess: invalidate,
    }),
    generateResults: useMutation({
      mutationFn: (examId: string) => generateExamResults(examId),
      onSuccess: invalidate,
    }),
    publishResults: useMutation({
      mutationFn: (examId: string) => publishExamResults(examId),
      onSuccess: invalidate,
    }),
  };
}
