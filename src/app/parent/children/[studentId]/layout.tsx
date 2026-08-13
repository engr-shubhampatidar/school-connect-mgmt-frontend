"use client";

import { use } from "react";
import { ChildSubnav, ChildSwitcher } from "@/modules/parent-portal";

export default function ParentChildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);

  return (
    <div>
      <div className="mx-auto px-4 pt-4">
        <ChildSwitcher studentId={studentId} />
        <div className="mt-4">
          <ChildSubnav studentId={studentId} />
        </div>
      </div>
      {children}
    </div>
  );
}
