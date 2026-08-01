export const MAX_DOCUMENT_FILE_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

/** @deprecated Prefer ADMIN_API.DOCUMENTS_UPLOAD via documents API helpers */
export const DOCUMENT_UPLOAD_PATH = "/api/uploads";

export const DOCUMENT_ENTITY_TYPES = ["STUDENT", "TEACHER"] as const;

/** Allowed API values for documentType */
export const DOCUMENT_TYPES = [
  { value: "PROFILE_PHOTO", label: "Profile Photo" },
  { value: "ID_PROOF", label: "ID Proof" },
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { value: "MARKSHEET", label: "Marksheet" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "OTHER", label: "Other" },
] as const;

export const STUDENT_DOCUMENT_TYPES = DOCUMENT_TYPES;
export const TEACHER_DOCUMENT_TYPES = DOCUMENT_TYPES;
