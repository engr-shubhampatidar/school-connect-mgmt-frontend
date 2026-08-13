"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function PortalPageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto px-4 py-6">{children}</div>;
}

export function PortalPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[24px] font-[600] text-[#021034]">{title}</h1>
        {description ? (
          <p className="mt-1 text-[14px] text-[#737373]">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function PortalLoading({ rows = 3 }: { rows?: number }) {
  return (
    <PortalPageShell>
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </PortalPageShell>
  );
}

export function PortalError({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <PortalPageShell>
      <Card>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-700">{message}</p>
          {onRetry ? (
            <Button variant="dark" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      </Card>
    </PortalPageShell>
  );
}

export function PortalEmpty({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card>
      <div className="py-8 text-center">
        <h3 className="text-base font-medium text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
    </Card>
  );
}

export const RELATIONSHIP_LABELS: Record<string, string> = {
  FATHER: "Father",
  MOTHER: "Mother",
  GUARDIAN: "Guardian",
  OTHER: "Other",
};

export function formatClassLabel(
  className?: string | null,
  section?: string | null,
): string {
  const parts = [className, section].filter(Boolean);
  return parts.length ? parts.join(" - ") : "Class not assigned";
}

export function formatErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}
