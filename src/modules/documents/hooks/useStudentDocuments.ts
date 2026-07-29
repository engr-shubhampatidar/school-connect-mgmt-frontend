"use client";

import { useState } from "react";
import API from "@/services/axios";
import { useToast } from "@/components/ui/use-toast";
import type { StudentDocument, UploadingDoc } from "../types";
import {
  ACCEPTED_DOCUMENT_TYPES,
  DOCUMENT_UPLOAD_PATH,
  MAX_DOCUMENT_FILE_SIZE,
} from "../constants";

export function useStudentDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [uploading, setUploading] = useState<UploadingDoc[]>([]);

  const handleDocumentUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const pending: UploadingDoc[] = [];
    const uploads: Array<Promise<void>> = [];

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type as (typeof ACCEPTED_DOCUMENT_TYPES)[number])) {
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
      const temp: UploadingDoc = { name: file.name, status: "uploading" };
      pending.push(temp);
      const formData = new FormData();
      formData.append("file", file);
      uploads.push(
        API.post(DOCUMENT_UPLOAD_PATH, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((resp) => {
            const url =
              (resp.data?.url as string) ||
              (resp.data?.fileUrl as string) ||
              "";
            if (!url) {
              temp.status = "error";
              temp.error = "Missing upload URL";
              return;
            }
            if (documents.some((d) => d.url === url)) {
              temp.status = "error";
              temp.error = "Duplicate document";
              return;
            }
            temp.status = "done";
            temp.url = url;
            setDocuments((prev) => [
              ...prev,
              { document_type: file.name, url },
            ]);
          })
          .catch((error) => {
            temp.status = "error";
            temp.error =
              error instanceof Error ? error.message : "Upload failed";
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

  const removeDocument = (url: string) => {
    setDocuments((prev) => prev.filter((d) => d.url !== url));
  };

  const resetDocuments = () => {
    setDocuments([]);
    setUploading([]);
  };

  return {
    documents,
    setDocuments,
    uploading,
    handleDocumentUpload,
    removeDocument,
    resetDocuments,
  };
}
