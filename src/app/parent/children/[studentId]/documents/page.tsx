"use client";

import { use } from "react";
import { ChildDocumentsView } from "@/modules/parent-portal";

export default function ParentChildDocumentsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildDocumentsView studentId={studentId} />;
}
