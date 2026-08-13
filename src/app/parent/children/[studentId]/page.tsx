"use client";

import { use } from "react";
import { ChildDashboardView } from "@/modules/parent-portal";

export default function ParentChildDashboardPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildDashboardView studentId={studentId} />;
}
