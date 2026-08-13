import type {
  Subject,
  SubjectsQuery,
  SubjectsResponse,
} from "@/modules/subjects/types/subjects";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";

export type {
  Subject,
  SubjectsQuery,
  SubjectsResponse,
} from "@/modules/subjects/types/subjects";

export async function fetchSubjects(
  query: SubjectsQuery = {},
): Promise<SubjectsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.page) params.page = query.page;
  if (query.pageSize) {
    // Backend PaginationSubjectDto enforces @Max(100) on `limit`
    const limit = Math.min(query.pageSize, 100);
    params.pageSize = limit;
    params.limit = limit;
  }
  const res = await API.get<{
    subjects?: Subject[];
    data?: Subject[];
    total?: number;
    page?: number;
    pageSize?: number;
    limit?: number;
  }>(ADMIN_API.SUBJECTS, { params });

  const body = res.data ?? {};
  const subjects: Subject[] = Array.isArray(body.subjects)
    ? body.subjects
    : Array.isArray(body.data)
      ? body.data
      : [];

  return {
    subjects,
    total: body.total ?? subjects.length,
    page: body.page ?? 1,
    pageSize: body.pageSize ?? body.limit ?? query.pageSize ?? 10,
  };
}

export async function createSubject(payload: { name: string }) {
  const res = await API.post<{ id: string }>(ADMIN_API.SUBJECTS, payload);
  return res.data;
}

/** Simplified subject shape for search/select UIs. */
export interface SubjectOption {
  id: string;
  name: string;
}

function normalizeSubjectItem(
  it: { id?: string; name?: string } | null,
): SubjectOption {
  if (!it) return { id: "", name: "" };
  return {
    id: String(it.id ?? ""),
    name: String(it.name ?? ""),
  };
}

export async function searchSubjects(search = "", _includeDeleted = false) {
  const res = await fetchSubjects({ search });
  return (res.subjects ?? []).map(normalizeSubjectItem);
}

export async function createSubjectOption(payload: { name: string }) {
  const created = await createSubject(payload);
  return normalizeSubjectItem({
    id: (created as { id?: string })?.id,
    name: payload.name,
  });
}
