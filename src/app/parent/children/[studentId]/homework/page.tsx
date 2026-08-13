"use client";

import { use } from "react";
import { ChildHomeworkListView } from "@/modules/parent-portal";

export default function ParentChildHomeworkPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildHomeworkListView studentId={studentId} />;
}
