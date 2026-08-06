"use client";

import { use } from "react";
import { ChildAnnouncementsView } from "@/modules/parent-portal";

export default function ParentChildAnnouncementsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  return <ChildAnnouncementsView studentId={studentId} />;
}
