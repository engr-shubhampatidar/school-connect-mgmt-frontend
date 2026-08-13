"use client";

import { use } from "react";
import { ChildProfileView } from "@/modules/parent-portal";

export default function ParentChildProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildProfileView studentId={studentId} />;
}
