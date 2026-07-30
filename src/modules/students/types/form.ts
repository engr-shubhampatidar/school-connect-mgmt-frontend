import type { StudentDocument } from "@/modules/documents/types";

export type { StudentDocument, UploadingDoc } from "@/modules/documents/types";

export type StudentProfileResponse = {
  studentId: string;
  id?: string;
  name: string;
  class_id: string;
  class_name?: string;
  email: string;
  phone_no: string;
  gender: "male" | "female" | "other";
  category: "General" | "OBC" | "SC" | "ST" | "EWS";
  admission_date: string | null;
  address: string;
  aadhar: string;
  guardian: {
    father_name: string;
    mother_name?: string | null;
    phone_no: string;
    email: string;
    address?: string | null;
  };
  student_documents?: StudentDocument[];
};
