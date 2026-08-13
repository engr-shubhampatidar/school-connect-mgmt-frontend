import type { AxiosRequestConfig } from "axios";
import { ADMIN_API, STUDENT_API, TEACHER_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  CreateHomeworkPayload,
  Homework,
  HomeworkQuery,
  HomeworkSubmission,
  Paginated,
  ReviewSubmissionPayload,
  StudentHomeworkDetail,
  SubmissionQuery,
  SubmitHomeworkPayload,
  UpdateHomeworkPayload,
} from "@/modules/homework/types";

type RoleScope = "admin" | "teacher" | "student";

function basePath(scope: RoleScope): string {
  if (scope === "admin") return ADMIN_API.HOMEWORK;
  if (scope === "teacher") return TEACHER_API.HOMEWORK;
  return STUDENT_API.HOMEWORK;
}

function detailPath(scope: RoleScope, id: string): string {
  if (scope === "admin") return ADMIN_API.HOMEWORK_BY_ID(id);
  if (scope === "teacher") return TEACHER_API.HOMEWORK_BY_ID(id);
  return STUDENT_API.HOMEWORK_BY_ID(id);
}

export async function fetchHomeworkList(
  scope: "admin" | "teacher",
  query: HomeworkQuery = {},
  config?: AxiosRequestConfig,
): Promise<Paginated<Homework>> {
  const res = await API.get<Paginated<Homework>>(basePath(scope), {
    params: query,
    ...(config ?? {}),
  });
  return res.data;
}

export async function fetchStudentHomeworkList(
  query: HomeworkQuery = {},
  config?: AxiosRequestConfig,
): Promise<Paginated<Homework>> {
  const res = await API.get<Paginated<Homework>>(STUDENT_API.HOMEWORK, {
    params: query,
    ...(config ?? {}),
  });
  return res.data;
}

export async function fetchHomeworkDetail(
  scope: "admin" | "teacher",
  id: string,
): Promise<Homework> {
  const res = await API.get<Homework>(detailPath(scope, id));
  return res.data;
}

export async function fetchStudentHomeworkDetail(
  id: string,
): Promise<StudentHomeworkDetail> {
  const res = await API.get<StudentHomeworkDetail>(
    STUDENT_API.HOMEWORK_BY_ID(id),
  );
  return res.data;
}

export async function createHomework(
  scope: "admin" | "teacher",
  payload: CreateHomeworkPayload,
): Promise<Homework> {
  const res = await API.post<Homework>(basePath(scope), payload);
  return res.data;
}

export async function updateHomework(
  scope: "admin" | "teacher",
  id: string,
  payload: UpdateHomeworkPayload,
): Promise<Homework> {
  const res = await API.patch<Homework>(detailPath(scope, id), payload);
  return res.data;
}

export async function updateHomeworkStatus(
  scope: "admin" | "teacher",
  id: string,
  status: "DRAFT" | "PUBLISHED" | "CLOSED",
): Promise<Homework> {
  const res = await API.patch<Homework>(
    `${detailPath(scope, id)}/status`,
    { status },
  );
  return res.data;
}

export async function deleteHomework(
  scope: "admin" | "teacher",
  id: string,
): Promise<{ success: boolean }> {
  const res = await API.delete<{ success: boolean }>(detailPath(scope, id));
  return res.data;
}

export async function replaceHomeworkClasses(
  scope: "admin" | "teacher",
  id: string,
  classIds: string[],
) {
  const res = await API.put(`${detailPath(scope, id)}/classes`, { classIds });
  return res.data;
}

export async function fetchSubmissions(
  scope: "admin" | "teacher",
  homeworkId: string,
  query: SubmissionQuery = {},
): Promise<Paginated<HomeworkSubmission>> {
  const res = await API.get<Paginated<HomeworkSubmission>>(
    `${detailPath(scope, homeworkId)}/submissions`,
    { params: query },
  );
  return res.data;
}

export async function reviewSubmission(
  scope: "admin" | "teacher",
  homeworkId: string,
  submissionId: string,
  payload: ReviewSubmissionPayload,
): Promise<HomeworkSubmission> {
  const res = await API.patch<HomeworkSubmission>(
    `${detailPath(scope, homeworkId)}/submissions/${submissionId}/review`,
    payload,
  );
  return res.data;
}

export async function submitHomework(
  homeworkId: string,
  payload: SubmitHomeworkPayload,
): Promise<HomeworkSubmission> {
  const res = await API.post<HomeworkSubmission>(
    STUDENT_API.HOMEWORK_SUBMIT(homeworkId),
    payload,
  );
  return res.data;
}
