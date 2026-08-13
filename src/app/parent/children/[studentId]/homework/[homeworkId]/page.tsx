"use client";

import { use } from "react";
import { ChildHomeworkDetailView } from "@/modules/parent-portal";

export default function ParentChildHomeworkDetailPage({
  params,
}: {
  params: Promise<{ studentId: string; homeworkId: string }>;
}) {
  const { studentId, homeworkId } = use(params);
  return (
    <ChildHomeworkDetailView studentId={studentId} homeworkId={homeworkId} />
  );
}
