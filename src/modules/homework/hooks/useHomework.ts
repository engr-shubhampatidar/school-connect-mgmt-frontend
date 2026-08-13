"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHomework,
  deleteHomework,
  fetchHomeworkDetail,
  fetchHomeworkList,
  fetchStudentHomeworkDetail,
  fetchStudentHomeworkList,
  fetchSubmissions,
  reviewSubmission,
  submitHomework,
  updateHomework,
  updateHomeworkStatus,
} from "@/modules/homework/api/homework";
import {
  HOMEWORK_PAGE_SIZE,
  homeworkQueryKeys,
} from "@/modules/homework/constants/query-keys";
import type {
  CreateHomeworkPayload,
  HomeworkQuery,
  ReviewSubmissionPayload,
  SubmissionQuery,
  SubmitHomeworkPayload,
  UpdateHomeworkPayload,
} from "@/modules/homework/types";

export function useHomeworkList(
  scope: "admin" | "teacher",
  query: HomeworkQuery = {},
) {
  const q = { page: 1, limit: HOMEWORK_PAGE_SIZE, ...query };
  return useQuery({
    queryKey:
      scope === "admin"
        ? homeworkQueryKeys.adminList(q)
        : homeworkQueryKeys.teacherList(q),
    queryFn: () => fetchHomeworkList(scope, q),
  });
}

export function useAdminHomeworkList(query: HomeworkQuery = {}) {
  return useHomeworkList("admin", query);
}

export function useTeacherHomeworkList(query: HomeworkQuery = {}) {
  return useHomeworkList("teacher", query);
}

export function useStudentHomeworkList(query: HomeworkQuery = {}) {
  const q = { page: 1, limit: HOMEWORK_PAGE_SIZE, ...query };
  return useQuery({
    queryKey: homeworkQueryKeys.studentList(q),
    queryFn: () => fetchStudentHomeworkList(q),
  });
}

export function useHomeworkDetail(
  scope: "admin" | "teacher",
  id: string | undefined,
) {
  return useQuery({
    queryKey: homeworkQueryKeys.detail(id ?? ""),
    queryFn: () => fetchHomeworkDetail(scope, id!),
    enabled: Boolean(id),
  });
}

export function useStudentHomeworkDetail(id: string | undefined) {
  return useQuery({
    queryKey: homeworkQueryKeys.studentDetail(id ?? ""),
    queryFn: () => fetchStudentHomeworkDetail(id!),
    enabled: Boolean(id),
  });
}

export function useHomeworkSubmissions(
  scope: "admin" | "teacher",
  homeworkId: string | undefined,
  query: SubmissionQuery = {},
) {
  const q = { page: 1, limit: 20, ...query };
  return useQuery({
    queryKey: homeworkQueryKeys.submissions(homeworkId ?? "", q),
    queryFn: () => fetchSubmissions(scope, homeworkId!, q),
    enabled: Boolean(homeworkId),
  });
}

export function useHomeworkMutations(scope: "admin" | "teacher") {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: homeworkQueryKeys.all });

  const create = useMutation({
    mutationFn: (payload: CreateHomeworkPayload) =>
      createHomework(scope, payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateHomeworkPayload;
    }) => updateHomework(scope, id, payload),
    onSuccess: invalidate,
  });

  const setStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "DRAFT" | "PUBLISHED" | "CLOSED";
    }) => updateHomeworkStatus(scope, id, status),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteHomework(scope, id),
    onSuccess: invalidate,
  });

  const review = useMutation({
    mutationFn: ({
      homeworkId,
      submissionId,
      payload,
    }: {
      homeworkId: string;
      submissionId: string;
      payload: ReviewSubmissionPayload;
    }) => reviewSubmission(scope, homeworkId, submissionId, payload),
    onSuccess: invalidate,
  });

  return { create, update, setStatus, remove, review };
}

export function useSubmitHomeworkMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      homeworkId,
      payload,
    }: {
      homeworkId: string;
      payload: SubmitHomeworkPayload;
    }) => submitHomework(homeworkId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: homeworkQueryKeys.all }),
  });
}
