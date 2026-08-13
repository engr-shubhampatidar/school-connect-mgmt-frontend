"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createParent,
  fetchParents,
  getParentById,
  linkChildren,
  unlinkChild,
  updateParent,
} from "@/modules/parents/api/adminParents";
import {
  PARENTS_PAGE_SIZE,
  parentQueryKeys,
} from "@/modules/parents/constants/query-keys";
import type {
  CreateParentPayload,
  LinkChildrenPayload,
  ParentsQuery,
  UpdateParentPayload,
} from "@/modules/parents/types";

export function useParentsQuery(query: ParentsQuery = {}) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? PARENTS_PAGE_SIZE;

  return useQuery({
    queryKey: parentQueryKeys.list({
      search: query.search,
      status: query.status,
      page,
      pageSize,
    }),
    queryFn: () =>
      fetchParents({
        ...query,
        page,
        pageSize,
      }),
  });
}

export function useParentQuery(id: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.detail(id ?? ""),
    queryFn: () => getParentById(id!),
    enabled: Boolean(id),
  });
}

export function useParentMutations() {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: parentQueryKeys.all });

  const create = useMutation({
    mutationFn: (payload: CreateParentPayload) => createParent(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateParentPayload;
    }) => updateParent(id, payload),
    onSuccess: invalidate,
  });

  const link = useMutation({
    mutationFn: ({
      parentId,
      payload,
    }: {
      parentId: string;
      payload: LinkChildrenPayload;
    }) => linkChildren(parentId, payload),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: parentQueryKeys.all });
      void qc.invalidateQueries({
        queryKey: parentQueryKeys.detail(vars.parentId),
      });
    },
  });

  const unlink = useMutation({
    mutationFn: ({
      parentId,
      studentId,
    }: {
      parentId: string;
      studentId: string;
    }) => unlinkChild(parentId, studentId),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: parentQueryKeys.all });
      void qc.invalidateQueries({
        queryKey: parentQueryKeys.detail(vars.parentId),
      });
    },
  });

  return { create, update, link, unlink, invalidate };
}
