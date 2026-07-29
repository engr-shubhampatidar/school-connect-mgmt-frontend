export type StudentDocument = {
  document_type: string;
  url: string;
};

export type UploadingDoc = {
  name: string;
  status: "uploading" | "error" | "done";
  url?: string;
  error?: string;
};

export type DocumentItem = {
  id: string;
  title: string;
  type?: string;
  href?: string;
};
