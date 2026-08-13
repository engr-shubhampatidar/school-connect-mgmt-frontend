import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  CreateParentPayload,
  CreateParentResponse,
  LinkChildrenPayload,
  Parent,
  ParentsQuery,
  ParentsResponse,
  UpdateParentPayload,
} from "@/modules/parents/types";

export async function fetchParents(
  query: ParentsQuery = {},
): Promise<ParentsResponse> {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.status) params.status = query.status;
  if (query.page) params.page = query.page;
  if (query.pageSize) params.limit = query.pageSize;

  const res = await API.get<{
    data?: Parent[];
    total?: number;
    page?: number;
    limit?: number;
  }>(ADMIN_API.PARENTS, { params });

  const {
    data = [],
    total = 0,
    page = query.page ?? 1,
    limit = query.pageSize ?? 10,
  } = res.data ?? {};

  return {
    parents: data,
    total,
    page,
    pageSize: limit,
  };
}

export async function getParentById(id: string): Promise<Parent> {
  const res = await API.get<Parent>(ADMIN_API.PARENT_BY_ID(id));
  return res.data;
}

export async function createParent(
  payload: CreateParentPayload,
): Promise<CreateParentResponse> {
  const res = await API.post<CreateParentResponse>(ADMIN_API.PARENTS, payload);
  return res.data;
}

export async function updateParent(
  id: string,
  payload: UpdateParentPayload,
): Promise<Parent> {
  const res = await API.patch<Parent>(ADMIN_API.PARENT_BY_ID(id), payload);
  return res.data;
}

export async function linkChildren(
  parentId: string,
  payload: LinkChildrenPayload,
): Promise<Parent> {
  const res = await API.post<Parent>(
    ADMIN_API.PARENT_CHILDREN(parentId),
    payload,
  );
  return res.data;
}

export async function unlinkChild(
  parentId: string,
  studentId: string,
): Promise<void> {
  await API.delete(ADMIN_API.PARENT_UNLINK_CHILD(parentId, studentId));
}
