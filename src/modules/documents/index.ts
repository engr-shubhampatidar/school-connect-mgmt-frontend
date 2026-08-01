export type {
  StudentDocument,
  UploadingDoc,
  DocumentItem,
  DocumentEntityType,
  DocumentType,
  EntityDocument,
  GetDocumentsParams,
  UploadDocumentParams,
  DocumentTypeOption,
} from "./types";
export { useStudentDocuments } from "./hooks/useStudentDocuments";
export { useEntityDocuments } from "./hooks/useEntityDocuments";
export { default as DocumentsGrid } from "./components/DocumentsGrid";
export { default as StudentDocumentsSection } from "./components/StudentDocumentsSection";
export { default as EntityDocumentsSection } from "./components/EntityDocumentsSection";
export {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "./api/documents";
export {
  MAX_DOCUMENT_FILE_SIZE,
  ACCEPTED_DOCUMENT_TYPES,
  DOCUMENT_UPLOAD_PATH,
  DOCUMENT_ENTITY_TYPES,
  DOCUMENT_TYPES,
  STUDENT_DOCUMENT_TYPES,
  TEACHER_DOCUMENT_TYPES,
} from "./constants";
