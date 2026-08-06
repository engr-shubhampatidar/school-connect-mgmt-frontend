"use client";

import { use } from "react";
import { ChildAttendanceView } from "@/modules/parent-portal";

export default function ParentChildAttendancePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildAttendanceView studentId={studentId} />;
}
