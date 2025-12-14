import API from "./axios";
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
