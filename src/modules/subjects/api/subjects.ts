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
  if (query.pageSize) params.pageSize = query.pageSize;
  const res = await API.get<SubjectsResponse>(ADMIN_API.SUBJECTS, { params });
  const data = res.data as unknown;

  const subjects: Subject[] = (data as SubjectsResponse)?.subjects ?? [];
  const total: number = (data as SubjectsResponse)?.total ?? 0;
  const page: number = (data as SubjectsResponse)?.page ?? 1;
  const pageSize: number = (data as unknown as { limit: number })?.limit ?? 10;

  return {
    subjects,
    total,
    page,
    pageSize,
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
