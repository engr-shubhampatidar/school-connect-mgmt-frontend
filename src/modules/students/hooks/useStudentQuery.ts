"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/modules/students/api/adminStudents";
import { studentQueryKeys } from "@/modules/students/constants/query-keys";

export function useStudentQuery(studentId: string | undefined) {
  return useQuery({
    queryKey: studentQueryKeys.detail(studentId ?? ""),
    queryFn: () => getStudentById(studentId as string),
    enabled: Boolean(studentId),
  });
}
