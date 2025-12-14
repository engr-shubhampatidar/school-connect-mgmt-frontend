import API from "./axios";
import type { AxiosRequestConfig } from "axios";
import { ADMIN_API } from "./api-routes";

export type Student = {
  id: string;
  name: string;
  rollNo?: string | number | null;
  class?: string | null;
  createdAt: string;
};

export type StudentsResponse = {
  students: Student[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type StudentsQuery = {
  search?: string;
  class?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchStudents(
  query: StudentsQuery = {}
): Promise<StudentsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.class) params.class = query.class;
  if (query.status) params.status = query.status;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;

  const res = await API.get<StudentsResponse>(ADMIN_API.STUDENTS, { params });
  return res.data;
}

export type Teacher = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subjects?: string[] | null;
  assignedClasses?: string[] | null;
  invitedAt?: string | null;
};

export type TeachersResponse = {
  teachers: Teacher[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type TeachersQuery = {
  search?: string;
  email?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchTeachers(
  query: TeachersQuery = {},
  config?: AxiosRequestConfig
): Promise<TeachersResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.email) params.email = query.email;
  if (query.subject) params.subject = query.subject;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<TeachersResponse>(ADMIN_API.TEACHERS, {
    params,
    ...(config ?? {}),
  });
  return res.data;
}

export type ClassItem = {
  id: string;
  name: string;
  section?: string | null;
  createdAt?: string;
};

export type ClassesResponse = {
  classes: ClassItem[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type ClassesQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchClasses(
  query: ClassesQuery = {}
): Promise<ClassesResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<ClassesResponse>(ADMIN_API.CLASSES, { params });
  return res.data;
}

export async function createClass(payload: {
  name: string;
  section?: string | null;
}) {
  const res = await API.post<{ id: string } | ClassItem>(
    ADMIN_API.CLASSES,
    payload
  );
  return res.data;
}

export type Subject = {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
};

export type SubjectsResponse = {
  subjects: Subject[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type SubjectsQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchSubjects(
  query: SubjectsQuery = {}
): Promise<SubjectsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<SubjectsResponse>(ADMIN_API.SUBJECTS, { params });
  return res.data;
}

export async function createSubject(payload: { name: string; code: string }) {
  const res = await API.post<{ id: string }>(ADMIN_API.SUBJECTS, payload);
  return res.data;
}
