"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../api/documents";
import {
  ACCEPTED_DOCUMENT_TYPES,
  MAX_DOCUMENT_FILE_SIZE,
} from "../constants";
import type {
  DocumentEntityType,
  DocumentTypeOption,
  EntityDocument,
  UploadingDoc,
} from "../types";

type UseEntityDocumentsOptions = {
  entityType: DocumentEntityType;
  entityId: string;
  documentTypes: readonly DocumentTypeOption[];
  /** Optional filter — omit to load all documents for the entity in one request. */
  documentType?: string;
};

export function useEntityDocuments({
  entityType,
  entityId,
  documentTypes,
  documentType,
}: UseEntityDocumentsOptions) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<EntityDocument[]>([]);
  const [uploading, setUploading] = useState<UploadingDoc[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState(
    documentTypes[0]?.value ?? "",
  );

  const refreshDocuments = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const list = await getDocuments({
        entityType,
        entityId,
        ...(documentType ? { documentType } : {}),
      });
      setDocuments(list);
    } catch (error) {
      toast({
        title: "Failed to load documents",
        description:
          error instanceof Error ? error.message : "Please try again",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
    // toast identity changes every provider render — omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentType, entityId, entityType]);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  useEffect(() => {
    if (
      documentTypes.length > 0 &&
      !documentTypes.some((t) => t.value === selectedDocumentType)
    ) {
      setSelectedDocumentType(documentTypes[0].value);
    }
  }, [documentTypes, selectedDocumentType]);

  const handleDocumentUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!selectedDocumentType) {
      toast({
        title: "Select a document type",
        description: "Choose which document you are uploading",
        type: "error",
      });
      return;
    }
    if (!entityId) return;

    const pending: UploadingDoc[] = [];
    const uploads: Array<Promise<void>> = [];

    Array.from(files).forEach((file) => {
      if (
        !ACCEPTED_DOCUMENT_TYPES.includes(
          file.type as (typeof ACCEPTED_DOCUMENT_TYPES)[number],
        )
      ) {
        toast({
          title: "Unsupported file type",
          description: "Only PDF, JPG, PNG allowed",
          type: "error",
        });
        return;
      }
      if (file.size > MAX_DOCUMENT_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Max size is 5MB per file",
          type: "error",
        });
        return;
      }

      const temp: UploadingDoc = {
        name: file.name,
        status: "uploading",
        documentType: selectedDocumentType,
      };
      pending.push(temp);

      uploads.push(
        uploadDocument({
          file,
          entityType,
          entityId,
          documentType: selectedDocumentType,
        })
          .then((doc) => {
            temp.status = "done";
            temp.url = doc.url;
            setDocuments((prev) => [...prev, doc]);
            toast({
              title: "Document uploaded",
              type: "success",
            });
          })
          .catch((error) => {
            temp.status = "error";
            temp.error =
              error instanceof Error ? error.message : "Upload failed";
            toast({
              title: "Upload failed",
              description: temp.error,
              type: "error",
            });
          }),
      );
    });

    setUploading((prev) => [...prev, ...pending]);
    await Promise.all(uploads);
    setUploading((prev) => {
      const existingErrors = prev.filter((p) => p.status === "error");
      const newErrors = pending.filter((p) => p.status === "error");
      return [...existingErrors, ...newErrors];
    });
  };

  const handleDocumentDelete = async (documentId: string) => {
    if (!documentId) return;
    setDeletingIds((prev) => [...prev, documentId]);
    try {
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      toast({
        title: "Document deleted",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        type: "error",
      });
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== documentId));
    }
  };

  const getLabelForType = (documentTypeValue: string) =>
    documentTypes.find((t) => t.value === documentTypeValue)?.label ??
    documentTypeValue;

  return {
    documents,
    uploading,
    deletingIds,
    loading,
    selectedDocumentType,
    setSelectedDocumentType,
    handleDocumentUpload,
    handleDocumentDelete,
    refreshDocuments,
    getLabelForType,
  };
}
