"use client";

import { HomeworkSubmissionsView } from "@/modules/homework/components/HomeworkSubmissionsView";

export default function AdminHomeworkSubmissionsPage({
  params,
}: {
  params: Promise<{ homeworkId: string }>;
}) {
  return <HomeworkSubmissionsView params={params} scope="admin" />;
}
