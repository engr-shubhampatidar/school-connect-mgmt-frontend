import type { AxiosRequestConfig } from "axios";
import { ADMIN_API } from "@/config/api-routes";
import API from "@/services/axios";
import type {
  EntityDocument,
  GetDocumentsParams,
  UploadDocumentParams,
} from "../types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function pickNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function normalizeDocument(raw: unknown): EntityDocument | null {
  const obj = asRecord(raw);
  const id = pickString(obj.id, obj._id, obj.documentId);
  const url = pickString(
    obj.url,
    obj.fileUrl,
    obj.file_url,
    obj.documentUrl,
    obj.document_url,
  );
  const documentType = pickString(
    obj.documentType,
    obj.document_type,
    obj.type,
  );
  const entityId = pickString(obj.entityId, obj.entity_id);
  const entityType = pickString(obj.entityType, obj.entity_type);

  if (!url && !id) return null;

  return {
    id: id || url,
    entityType,
    entityId,
    documentType,
    url,
    fileName: (pickString(obj.fileName, obj.file_name) || null) as string | null,
    originalName: (pickString(
      obj.originalName,
      obj.original_name,
      obj.name,
    ) || null) as string | null,
    mimeType: (pickString(obj.mimeType, obj.mime_type, obj.contentType) ||
      null) as string | null,
    size: pickNumber(obj.size, obj.fileSize, obj.file_size),
    createdAt: (pickString(obj.createdAt, obj.created_at) || null) as
      | string
      | null,
  };
}

function extractDocumentList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  const data = asRecord(payload);
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.documents)) return data.documents;
  if (Array.isArray(data.items)) return data.items;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return [data.data];
  }
  if (Object.keys(data).length > 0 && (data.url || data.fileUrl || data.id)) {
    return [data];
  }
  return [];
}

export async function getDocuments(
  params: GetDocumentsParams,
  config?: AxiosRequestConfig,
): Promise<EntityDocument[]> {
  const query: Record<string, string> = {
    entityType: params.entityType,
    entityId: params.entityId,
  };
  if (params.documentType) query.documentType = params.documentType;

  const res = await API.get(ADMIN_API.DOCUMENTS, {
    params: query,
    ...(config ?? {}),
  });

  return extractDocumentList(res.data)
    .map(normalizeDocument)
    .filter((doc): doc is EntityDocument => Boolean(doc));
}

export async function uploadDocument(
  params: UploadDocumentParams,
  config?: AxiosRequestConfig,
): Promise<EntityDocument> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("entityType", params.entityType);
  formData.append("entityId", params.entityId);
  formData.append("documentType", params.documentType);

  const res = await API.post(ADMIN_API.DOCUMENTS_UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...(config ?? {}),
  });

  const list = extractDocumentList(res.data)
    .map(normalizeDocument)
    .filter((doc): doc is EntityDocument => Boolean(doc));

  if (list[0]) return list[0];

  const normalized = normalizeDocument(res.data);
  if (normalized) return normalized;

  return {
    id: `${params.entityId}-${params.documentType}-${Date.now()}`,
    entityType: params.entityType,
    entityId: params.entityId,
    documentType: params.documentType,
    url: pickString(
      asRecord(res.data).url,
      asRecord(res.data).fileUrl,
      asRecord(asRecord(res.data).data).url,
      asRecord(asRecord(res.data).data).fileUrl,
    ),
    fileName: params.file.name,
    originalName: params.file.name,
    mimeType: params.file.type,
    size: params.file.size,
    createdAt: null,
  };
}

export async function deleteDocument(
  documentId: string,
  config?: AxiosRequestConfig,
): Promise<void> {
  await API.delete(ADMIN_API.DOCUMENT_BY_ID(documentId), {
    ...(config ?? {}),
  });
}
