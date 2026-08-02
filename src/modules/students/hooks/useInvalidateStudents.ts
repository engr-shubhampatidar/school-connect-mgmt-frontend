"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { studentQueryKeys } from "@/modules/students/constants/query-keys";

/** Invalidates list/detail caches after create or update. */
export function useInvalidateStudents() {
  const queryClient = useQueryClient();

  const invalidateLists = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() });
  }, [queryClient]);

  const invalidateDetail = useCallback(
    (id: string) => {
      return queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(id),
      });
    },
    [queryClient],
  );

  const invalidateAll = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: studentQueryKeys.all });
  }, [queryClient]);

  return { invalidateLists, invalidateDetail, invalidateAll };
}
