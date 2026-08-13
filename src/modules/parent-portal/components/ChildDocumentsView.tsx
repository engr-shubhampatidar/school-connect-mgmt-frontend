"use client";

import DocumentsGrid from "@/modules/documents/components/DocumentsGrid";
import { DOCUMENT_TYPES } from "@/modules/documents/constants";
import type { DocumentItem } from "@/modules/documents/types";
import { useChildDocumentsQuery } from "@/modules/parent-portal/hooks/useParentPortal";
import {
  formatErrorMessage,
  PortalEmpty,
  PortalError,
  PortalLoading,
  PortalPageHeader,
  PortalPageShell,
} from "@/modules/parent-portal/components/PortalState";

function labelForType(type: string): string {
  const match = DOCUMENT_TYPES.find((d) => d.value === type);
  return match?.label ?? type.replace(/_/g, " ");
}

export default function ChildDocumentsView({
  studentId,
}: {
  studentId: string;
}) {
  const { data, isLoading, error, refetch } = useChildDocumentsQuery(studentId);

  if (isLoading) return <PortalLoading rows={3} />;
  if (error) {
    return (
      <PortalError
        message={formatErrorMessage(error, "Failed to load documents")}
        onRetry={() => void refetch()}
      />
    );
  }

  const docs = data ?? [];
  const items: DocumentItem[] = docs.map((d) => ({
    id: d.id,
    title: d.originalName || d.fileName || labelForType(d.documentType),
    type: labelForType(d.documentType),
    href: d.url,
  }));

  return (
    <PortalPageShell>
      <PortalPageHeader
        title="Documents"
        description="Uploaded student documents (read-only)"
      />

      {items.length === 0 ? (
        <PortalEmpty
          title="No documents uploaded"
          description="Documents uploaded by the school will appear here."
        />
      ) : (
        <DocumentsGrid title="Student documents" documents={items} />
      )}
    </PortalPageShell>
  );
}
