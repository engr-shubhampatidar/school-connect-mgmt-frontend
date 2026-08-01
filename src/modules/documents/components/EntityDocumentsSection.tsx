"use client";

import { Eye, Trash2, Upload } from "lucide-react";
import type {
  DocumentTypeOption,
  EntityDocument,
  UploadingDoc,
} from "../types";

type Props = {
  title?: string;
  documentTypes: readonly DocumentTypeOption[];
  selectedDocumentType: string;
  onDocumentTypeChange: (value: string) => void;
  documents: EntityDocument[];
  uploading: UploadingDoc[];
  deletingIds?: string[];
  loading?: boolean;
  onUpload: (files: FileList | null) => void;
  onDelete: (documentId: string) => void;
  getLabelForType: (documentType: string) => string;
};

function fileExtensionLabel(doc: EntityDocument): string {
  if (doc.mimeType?.includes("pdf")) return "PDF";
  if (doc.mimeType?.includes("jpeg") || doc.mimeType?.includes("jpg"))
    return "JPG";
  if (doc.mimeType?.includes("png")) return "PNG";
  const fromName = (doc.originalName || doc.fileName || "")
    .split(".")
    .pop()
    ?.toUpperCase();
  if (fromName && fromName.length <= 4) return fromName;
  const fromUrl = doc.url.split(".").pop()?.split("?")[0]?.toUpperCase();
  if (fromUrl && fromUrl.length <= 4) return fromUrl;
  return "FILE";
}

function formatFileSize(bytes?: number | null): string | null {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadedAt(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EntityDocumentsSection({
  title = "Uploaded Documents",
  documentTypes,
  selectedDocumentType,
  onDocumentTypeChange,
  documents,
  uploading,
  deletingIds = [],
  loading = false,
  onUpload,
  onDelete,
  getLabelForType,
}: Props) {
  return (
    <div className="w-full max-w-full bg-white rounded-xl border border-blue-200 p-[20px]">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      <div
        onDrop={(e) => {
          e.preventDefault();
          onUpload(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="mb-5 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#C5D6F5] bg-[#F9FBFF] px-6 py-8 text-center"
      >
        <Upload className="h-5 w-5 text-[#64748B]" />
        <p className="mt-2 text-sm text-[#64748B]">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-[#94A3B8]">PDF, JPG, or PNG (Max size: 5MB)</p>

        <div className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="entity-document-type">
            Document type
          </label>
          <select
            id="entity-document-type"
            value={selectedDocumentType}
            onChange={(e) => onDocumentTypeChange(e.target.value)}
            className="w-full rounded-md border border-[#D7E3FC] bg-white px-3 py-2 text-sm text-[#0F172A]"
          >
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".pdf,image/png,image/jpeg"
            className="w-full text-sm"
            onChange={(e) => onUpload(e.target.files)}
          />
        </div>
      </div>

      {uploading.length > 0 ? (
        <div className="mb-4 space-y-2">
          {uploading.map((doc, idx) => (
            <div
              key={`${doc.name}-${idx}`}
              className="flex items-center justify-between rounded-md border border-dashed border-[#D7E3FC] bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="text-[#0F172A]">
                {doc.name}
                {doc.documentType
                  ? ` · ${getLabelForType(doc.documentType)}`
                  : ""}
              </span>
              <span className="text-xs text-slate-500">
                {doc.status === "uploading" ? "Uploading..." : doc.error}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-slate-500">No documents uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const sizeLabel = formatFileSize(doc.size);
            const uploadedAt = formatUploadedAt(doc.createdAt);
            const isDeleting = deletingIds.includes(doc.id);

            return (
              <div
                key={doc.id || `${doc.documentType}-${doc.url}`}
                className="flex items-start justify-between gap-3 border border-blue-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200 shrink-0 mt-0.5">
                    📄
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.originalName || doc.fileName || "Document"}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {getLabelForType(doc.documentType)}
                      {sizeLabel ? ` · ${sizeLabel}` : ""}
                      {uploadedAt ? ` · ${uploadedAt}` : ""}
                    </p>
                    <span className="inline-block px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                      {fileExtensionLabel(doc)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </a>
                  ) : null}
                  <button
                    type="button"
                    disabled={isDeleting || !doc.id}
                    onClick={() => onDelete(doc.id)}
                    className="flex items-center gap-1.5 text-sm text-[#E11D48] hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
