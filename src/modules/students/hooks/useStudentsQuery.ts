"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/modules/students/api/adminStudents";
import { studentQueryKeys, STUDENTS_PAGE_SIZE } from "@/modules/students/constants/query-keys";
import type { StudentsQuery } from "@/modules/students/types/admin";

export function useStudentsQuery(query: StudentsQuery) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? STUDENTS_PAGE_SIZE;

  return useQuery({
    queryKey: studentQueryKeys.list({
      search: query.search,
      classId: query.classId,
      page,
      pageSize,
    }),
    queryFn: () =>
      fetchStudents({
        ...query,
        page,
        pageSize,
      }),
  });
}
