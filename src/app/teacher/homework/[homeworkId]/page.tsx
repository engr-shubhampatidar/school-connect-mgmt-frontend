"use client";

import { HomeworkDetailView } from "@/modules/homework/components/HomeworkDetailView";

export default function TeacherHomeworkDetailPage({
  params,
}: {
  params: Promise<{ homeworkId: string }>;
}) {
  return <HomeworkDetailView params={params} scope="teacher" />;
}
