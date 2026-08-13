"use client";

import { use } from "react";
import { ChildFeesView } from "@/modules/parent-portal";

export default function ParentChildFeesPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildFeesView studentId={studentId} />;
}
