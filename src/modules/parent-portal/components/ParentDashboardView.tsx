"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  useParentChildrenQuery,
  useParentMeQuery,
} from "@/modules/parent-portal/hooks/useParentPortal";
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

export default function ParentDashboardView() {
  const meQuery = useParentMeQuery();
  const childrenQuery = useParentChildrenQuery();

  const me = meQuery.data;
  const children = childrenQuery.data ?? [];
  const loading = meQuery.isLoading || childrenQuery.isLoading;
  const error = meQuery.error || childrenQuery.error;

  if (loading) return <PortalLoading rows={3} />;
  if (error) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Failed to load dashboard")}
        onRetry={() => {
          void meQuery.refetch();
          void childrenQuery.refetch();
        }}
      />
    );
  }

  return (
    <PortalPageShell>
      <PortalPageHeader
        title={`Welcome${me?.fullName ? `, ${me.fullName}` : ""}`}
        description="View your linked children and follow their school activity."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-sm text-slate-500">Linked children</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {children.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Account email</div>
          <div className="mt-2 text-lg font-medium text-slate-900">
            {me?.email ?? "—"}
          </div>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">My Children</h2>
        <Link href="/parent/children">
          <Button variant="ghost">View all</Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <PortalEmpty
          title="No children linked yet"
          description="Ask your school admin to link your children to this parent account."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {children.map((child) => (
            <Card key={child.id}>
              <div className="font-medium text-slate-900">{child.fullName}</div>
              <div className="mt-1 text-sm text-slate-600">
                {formatClassLabel(child.className, child.section)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {RELATIONSHIP_LABELS[child.relationship] ?? child.relationship}
                {child.studentCode ? ` · ${child.studentCode}` : ""}
              </div>
              <div className="mt-4">
                <Link href={`/parent/children/${child.id}`}>
                  <Button variant="dark">Open dashboard</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PortalPageShell>
  );
}
