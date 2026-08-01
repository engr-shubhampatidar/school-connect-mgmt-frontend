import {
  DOCUMENT_ENTITY_TYPES,
  DOCUMENT_TYPES,
} from "../constants";

export type StudentDocument = {
  document_type: string;
  url: string;
};

export type UploadingDoc = {
  name: string;
  status: "uploading" | "error" | "done";
  url?: string;
  error?: string;
  documentType?: string;
};

export type DocumentItem = {
  id: string;
  title: string;
  type?: string;
  href?: string;
};

export type DocumentEntityType = (typeof DOCUMENT_ENTITY_TYPES)[number];

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["value"];
export type StudentDocumentType = DocumentType;
export type TeacherDocumentType = DocumentType;

export type EntityDocument = {
  id: string;
  entityType: DocumentEntityType | string;
  entityId: string;
  documentType: string;
  url: string;
  fileName?: string | null;
  originalName?: string | null;
  mimeType?: string | null;
  size?: number | null;
  createdAt?: string | null;
};

export type GetDocumentsParams = {
  entityType: DocumentEntityType;
  entityId: string;
  documentType?: string;
};

export type UploadDocumentParams = {
  file: File;
  entityType: DocumentEntityType;
  entityId: string;
  documentType: string;
};

export type DocumentTypeOption = {
  value: string;
  label: string;
};
