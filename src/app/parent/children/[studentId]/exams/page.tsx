"use client";

import { use } from "react";
import { ChildExamsView } from "@/modules/parent-portal";

export default function ParentChildExamsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildExamsView studentId={studentId} />;
}
