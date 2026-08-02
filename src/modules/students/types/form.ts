import type { StudentDocument } from "@/modules/documents/types";
import type { StudentDetails } from "./admin";

export type { StudentDocument, UploadingDoc } from "@/modules/documents/types";

/** Alias for GET /admin/students/{id} used by the update dialog loader */
export type StudentProfileResponse = StudentDetails & {
  /** Legacy snake_case fallbacks some environments may still return */
  phone_no?: string;
  admission_date?: string | null;
  aadhaar?: string | null;
  aadhar?: string;
  class_id?: string | { id?: string; name?: string; className?: string };
  class_name?: string;
  guardian?: {
    father_name?: string;
    mother_name?: string | null;
    phone_no?: string;
    email?: string;
    address?: string | null;
  };
  student_documents?: StudentDocument[];
};
