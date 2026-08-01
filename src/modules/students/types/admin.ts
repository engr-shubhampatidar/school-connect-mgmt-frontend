export type Student = {
  id: string;
  name: string;
  studentId?: string | number | null;
  className?: string | null;
  section?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  createdAt: string;
};

export type StudentsResponse = {
  students: Student[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type StudentsQuery = {
  search?: string;
  classId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

/** GET /admin/students/{id} response */
export interface StudentDetails {
  id: string;
  name: string;
  email: string;
  studentId: string;
  phoneNo: string | null;
  gender: string | null;
  admissionDate: string | null;
  aadhaarNumber: string | null;
  address: string | null;
  fatherName: string | null;
  fatherMobile: string | null;
  motherName: string | null;
  motherMobile: string | null;
  guardianName: string | null;
  guardianMobile: string | null;
  bloodGroup: string | null;
  medicalNotes: string | null;
  dob: string | null;
  /** Optional class fields when API includes them */
  classId?: string | null;
  className?: string | null;
  category?: string | null;
  /** @deprecated Prefer aadhaarNumber */
  aadhaar?: string | null;
}
