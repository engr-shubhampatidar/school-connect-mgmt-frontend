"use client";

import {
  EntityDocumentsSection,
  STUDENT_DOCUMENT_TYPES,
  useEntityDocuments,
} from "@/modules/documents";

type Props = {
  studentId: string;
};

export default function StudentProfileDocuments({ studentId }: Props) {
  const {
    documents,
    uploading,
    deletingIds,
    loading,
    selectedDocumentType,
    setSelectedDocumentType,
    handleDocumentUpload,
    handleDocumentDelete,
    getLabelForType,
  } = useEntityDocuments({
    entityType: "STUDENT",
    entityId: studentId,
    documentTypes: STUDENT_DOCUMENT_TYPES,
  });

  return (
    <EntityDocumentsSection
      title="Uploaded Documents"
      documentTypes={STUDENT_DOCUMENT_TYPES}
      selectedDocumentType={selectedDocumentType}
      onDocumentTypeChange={setSelectedDocumentType}
      documents={documents}
      uploading={uploading}
      deletingIds={deletingIds}
      loading={loading}
      onUpload={handleDocumentUpload}
      onDelete={handleDocumentDelete}
      getLabelForType={getLabelForType}
    />
  );
}
