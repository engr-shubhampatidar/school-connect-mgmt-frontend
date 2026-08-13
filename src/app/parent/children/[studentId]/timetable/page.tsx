"use client";

import { use } from "react";
import { ChildTimetableView } from "@/modules/parent-portal";

export default function ParentChildTimetablePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildTimetableView studentId={studentId} />;
}
