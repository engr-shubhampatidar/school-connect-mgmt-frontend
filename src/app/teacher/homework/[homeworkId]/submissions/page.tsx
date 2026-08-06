"use client";

import { HomeworkSubmissionsView } from "@/modules/homework/components/HomeworkSubmissionsView";

export default function TeacherHomeworkSubmissionsPage({
  params,
}: {
  params: Promise<{ homeworkId: string }>;
}) {
  return <HomeworkSubmissionsView params={params} scope="teacher" />;
}
