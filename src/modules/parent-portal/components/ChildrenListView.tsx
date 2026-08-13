"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useParentChildrenQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatClassLabel,
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
  RELATIONSHIP_LABELS,
} from "@/modules/parent-portal/components/PortalState";

export default function ChildrenListView() {
  const { data, isLoading, error, refetch } = useParentChildrenQuery();
  const children = data ?? [];

  if (isLoading) return <PortalLoading rows={3} />;
  if (error) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Failed to load children")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="My Children"
        description="Students linked to your parent account"
      />

      {children.length === 0 ? (
        <PortalEmpty
          title="No children linked"
          description="Contact the school admin to link student profiles."
        />
      ) : (
        <div className="divide-y divide-[#D7E3FC] rounded-lg border border-[#D7E3FC] bg-white">
          {children.map((child) => (
            <div
              key={child.id}
              className="flex flex-col justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <div className="font-medium text-slate-900">{child.fullName}</div>
                <div className="text-sm text-slate-600">
                  {formatClassLabel(child.className, child.section)}
                  {child.studentCode ? ` · ${child.studentCode}` : ""}
                </div>
                <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {RELATIONSHIP_LABELS[child.relationship] ??
                    child.relationship}
                </span>
              </div>
              <Link href={`/parent/children/${child.id}`}>
                <Button variant="dark">View</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </PortalPageShell>
  );
}
